{ pkgs, ... }:

let
  # Vale from its own release: nixpkgs trails it. Bump the version and the
  # four hashes from the release's checksums file.
  valeVersion = "3.24.0";
  valeAssets = {
    aarch64-darwin = { os = "macOS_arm64"; sha256 = "87b513f26499f6657c15cf7175ba5b058a7c1ff2bb2d4e07265db2dd43451e44"; };
    x86_64-darwin = { os = "macOS_64-bit"; sha256 = "eeb39e86f1daac27cc2a77fef3af1824d50559bdc22329fb25fb921c80c79472"; };
    aarch64-linux = { os = "Linux_arm64"; sha256 = "104cbd349279e50c4cb40adb70adf345d93cc4a3a0191f9e68bdccb97086b582"; };
    x86_64-linux = { os = "Linux_64-bit"; sha256 = "867534ddb678abca7f214bc4706ead0922bd5252ffe8035fc227013f66c8b214"; };
  };
  valeAsset = valeAssets.${pkgs.stdenv.hostPlatform.system};
  vale = pkgs.stdenvNoCC.mkDerivation {
    pname = "vale";
    version = valeVersion;
    src = pkgs.fetchurl {
      url = "https://github.com/errata-ai/vale/releases/download/v${valeVersion}/vale_${valeVersion}_${valeAsset.os}.tar.gz";
      inherit (valeAsset) sha256;
    };
    sourceRoot = ".";
    installPhase = "install -Dm755 vale $out/bin/vale";
  };
in
{
  # The tools the books and the design documents are checked and built with,
  # declared here so a session, a hook and a check take the same ones.
  packages = [
    pkgs.mdbook
    pkgs.mdbook-mermaid
    vale
  ];

  scripts = {
    # The voice, checked: every design document and every chapter.
    prose.exec = ''
      vale design books
    '';
    # One book, served with reload: `book-serve sluice`.
    book-serve.exec = ''
      mdbook serve "books/$1" --port "''${2:-3000}"
    '';
    # Every book built, which is what a site deploy runs.
    books-build.exec = ''
      for b in books/*/book.toml; do mdbook build "$(dirname "$b")"; done
    '';
  };
}
