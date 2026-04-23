#!/bin/sh
# MFTPlus CLI Installer
# This script installs mftctl, the MFTPlus command-line interface
#
# Usage:
#   curl -fsSL https://docs.mftplus.co.za/install.sh | sh
#   curl -fsSL https://docs.mftplus.co.za/install.sh | sh -s - -d ~/.local/bin
#
# Options:
#   -d, --dir <dir>    Installation directory (default: /usr/local/bin or ~/.local/bin)
#   -v, --version      Show version number and exit
#   -h, --help         Show this help message
#
# Environment variables:
#   MFTCTL_VERSION     Specific version to install (default: latest)
#   MFTCTL_DIR         Installation directory
#   MFTCTL_SKIP_VERIFY Skip signature verification (not recommended)

set -eu

# Constants
RELEASES_BASE="https://releases.mftplus.co.za/latest"
SCRIPT_VERSION="1.0.0"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
info() {
    printf "${BLUE}==> ${NC}%s\n" "$*"
}

success() {
    printf "${GREEN}==> ${NC}%s\n" "$*"
}

warn() {
    printf "${YELLOW}==> ${NC}%s\n" "$*"
}

error() {
    printf "${RED}==> ${NC}%s\n" "$*" >&2
}

# Show help
show_help() {
    cat << EOF
MFTPlus CLI Installer v${SCRIPT_VERSION}

Usage:
  curl -fsSL https://docs.mftplus.co.za/install.sh | sh
  curl -fsSL https://docs.mftplus.co.za/install.sh | sh -s - -d ~/.local/bin

Options:
  -d, --dir <dir>    Installation directory (default: /usr/local/bin or ~/.local/bin)
  -v, --version      Show version number and exit
  -h, --help         Show this help message

Environment Variables:
  MFTCTL_VERSION     Specific version to install (default: latest)
  MFTCTL_DIR         Installation directory
  MFTCTL_SKIP_VERIFY Skip signature verification (not recommended)

Examples:
  # Install to default location
  curl -fsSL https://docs.mftplus.co.za/install.sh | sh

  # Install to custom directory
  curl -fsSL https://docs.mftplus.co.za/install.sh | sh -s - -d ~/bin

  # Install specific version
  MFTCTL_VERSION=1.0.0 curl -fsSL https://docs.mftplus.co.za/install.sh | sh

EOF
}

# Detect operating system
detect_os() {
    os_type="$(uname -s)"
    case "$os_type" in
        Linux)
            echo "linux"
            ;;
        Darwin)
            echo "macos"
            ;;
        *)
            error "Unsupported operating system: $os_type"
            error "MFTPlus CLI supports Linux and macOS"
            error "For Windows, please download the MSI installer from:"
            error "  https://releases.mftplus.co.za/latest/mftplus-x64_64.msi"
            exit 1
            ;;
    esac
}

# Detect architecture
detect_arch() {
    arch_type="$(uname -m)"
    case "$arch_type" in
        x86_64|amd64)
            echo "amd64"
            ;;
        aarch64|arm64)
            echo "arm64"
            ;;
        *)
            error "Unsupported architecture: $arch_type"
            error "MFTPlus CLI supports amd64 and arm64"
            exit 1
            ;;
    esac
}

# Get installation directory
get_install_dir() {
    # Check if directory is provided via argument or environment
    if [ -n "${MFTCTL_DIR:-}" ]; then
        echo "$MFTCTL_DIR"
        return
    fi

    # Try /usr/local/bin first (requires sudo)
    if [ -w /usr/local/bin ] 2>/dev/null || command -v sudo >/dev/null 2>&1; then
        echo "/usr/local/bin"
        return
    fi

    # Fallback to ~/.local/bin
    echo "$HOME/.local/bin"
}

# Download file with progress indication
download_file() {
    url="$1"
    output="$2"

    if command -v curl >/dev/null 2>&1; then
        info "Downloading $(basename "$output")..."
        curl -fsSL "$url" -o "$output"
    elif command -v wget >/dev/null 2>&1; then
        info "Downloading $(basename "$output")..."
        wget -q "$url" -O "$output"
    else
        error "Neither curl nor wget is available"
        error "Please install curl or wget to continue"
        exit 1
    fi
}

# Verify checksum if signature file exists
verify_checksum() {
    binary="$1"
    os="$2"
    arch="$3"

    checksums_url="${RELEASES_BASE}/checksums.txt"
    checksums_file="${binary}.checksums"

    # Download checksums file
    if ! download_file "$checksums_url" "$checksums_file" 2>/dev/null; then
        warn "Could not download checksums file, skipping verification"
        return 0
    fi

    # Verify checksum
    info "Verifying checksum..."
    os_specific_checksum=$(grep "${os}_${arch}" "$checksums_file" 2>/dev/null || true)

    if [ -z "$os_specific_checksum" ]; then
        warn "Checksum for ${os}_${arch} not found, skipping verification"
        rm -f "$checksums_file"
        return 0
    fi

    expected_checksum=$(echo "$os_specific_checksum" | awk '{print $1}')
    actual_checksum=$(command -v sha256sum >/dev/null 2>&1 && sha256sum "$binary" | awk '{print $1}' || shasum -a 256 "$binary" | awk '{print $1}')

    if [ "$expected_checksum" = "$actual_checksum" ]; then
        success "Checksum verified"
        rm -f "$checksums_file"
        return 0
    else
        error "Checksum verification failed!"
        error "Expected: $expected_checksum"
        error "Actual:   $actual_checksum"
        rm -f "$checksums_file"
        return 1
    fi
}

# Install binary
install_binary() {
    source="$1"
    target_dir="$2"
    binary_name="mftctl"

    # Create target directory if it doesn't exist
    if [ ! -d "$target_dir" ]; then
        info "Creating directory: $target_dir"
        mkdir -p "$target_dir"
    fi

    target="$target_dir/$binary_name"

    # Check if writeable or if sudo is available
    if [ -w "$target_dir" ]; then
        info "Installing to $target"
        mv "$source" "$target"
        chmod +x "$target"
    elif command -v sudo >/dev/null 2>&1; then
        info "Installing to $target (using sudo)"
        sudo mv "$source" "$target"
        sudo chmod +x "$target"
    else
        # Fallback: install to ~/.local/bin and add to PATH message
        local_dir="$HOME/.local/bin"
        mkdir -p "$local_dir"
        info "Installing to $local_dir/$binary_name"
        mv "$source" "$local_dir/$binary_name"
        chmod +x "$local_dir/$binary_name"
        target="$local_dir/$binary_name"
    fi
}

# Check if $HOME/.local/bin is in PATH
check_and_add_path() {
    install_dir="$1"

    case ":$PATH:" in
        *:"$install_dir":*)
            # Already in PATH
            return
            ;;
    esac

    # Check shell config files
    shell_config=""
    if [ -n "${ZSH_VERSION:-}" ]; then
        shell_config="$HOME/.zshrc"
    elif [ -n "${BASH_VERSION:-}" ]; then
        shell_config="$HOME/.bashrc"
    fi

    if [ -n "$shell_config" ]; then
        warn ""
        warn "$install_dir is not in your PATH"
        warn ""
        warn "Add the following to $shell_config:"
        warn ""
        warn "  export PATH=\"$install_dir:\$PATH\""
        warn ""
        warn "Then run: source $shell_config"
        warn ""
    fi
}

# Main installation flow
main() {
    # Parse arguments
    install_dir=""
    show_version=false

    while [ $# -gt 0 ]; do
        case "$1" in
            -d|--dir)
                install_dir="$2"
                shift 2
                ;;
            -v|--version)
                show_version=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                echo "Use -h or --help for usage information"
                exit 1
                ;;
        esac
    done

    # Show version and exit
    if [ "$show_version" = true ]; then
        echo "MFTPlus CLI Installer v${SCRIPT_VERSION}"
        exit 0
    fi

    echo ""
    info "MFTPlus CLI Installer"
    echo ""

    # Detect OS and architecture
    os=$(detect_os)
    arch=$(detect_arch)
    info "Detected: $os $arch"

    # Determine version
    version="${MFTCTL_VERSION:-latest}"
    info "Version: $version"

    # Get installation directory
    if [ -z "$install_dir" ]; then
        install_dir=$(get_install_dir)
    fi
    info "Installation directory: $install_dir"

    # Construct download URL
    binary_name="mftctl-${os}-${arch}"
    download_url="${RELEASES_BASE}/${binary_name}"

    # Create temporary directory
    tmp_dir=$(mktemp -d)
    trap "rm -rf $tmp_dir" EXIT

    # Download binary
    binary_file="$tmp_dir/$binary_name"
    if ! download_file "$download_url" "$binary_file"; then
        error "Failed to download mftctl"
        error "Please check your internet connection and try again"
        error "If the problem persists, visit: https://docs.mftplus.co.za/guide/installation"
        exit 1
    fi

    # Verify checksum (skip if MFTCTL_SKIP_VERIFY is set)
    if [ "${MFTCTL_SKIP_VERIFY:-}" != "1" ]; then
        if ! verify_checksum "$binary_file" "$os" "$arch"; then
            error "Checksum verification failed"
            error "To skip verification (not recommended), set MFTCTL_SKIP_VERIFY=1"
            exit 1
        fi
    else
        warn "Skipping signature verification"
    fi

    # Install binary
    install_binary "$binary_file" "$install_dir"

    # Check PATH
    if echo "$install_dir" | grep -q "$HOME/.local"; then
        check_and_add_path "$install_dir"
    fi

    # Success message
    echo ""
    success "MFTPlus CLI installed successfully!"
    echo ""
    info "Binary: $install_dir/mftctl"
    echo ""

    # Show quick start
    info "Quick Start:"
    echo ""
    echo "  # Show version"
    echo "  mftctl --version"
    echo ""
    echo "  # Get help"
    echo "  mftctl --help"
    echo ""
    echo "  # Authenticate with your dashboard"
    echo "  mftctl login <api-key> --server http://localhost:3001"
    echo ""

    info "Documentation: https://docs.mftplus.co.za"
    echo ""
}

# Run main
main "$@"
