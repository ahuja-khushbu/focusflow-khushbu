// On Linux (Docker/CI), debian12 has no ARM64 MongoDB binary.
// ubuntu2204 does, and its binary runs fine on Debian 12 (same glibc).
if (process.platform === 'linux') {
  process.env.MONGOMS_VERSION = process.env.MONGOMS_VERSION || '7.0.14';
  process.env.MONGOMS_DISTRO = process.env.MONGOMS_DISTRO || 'ubuntu-22.04';
}
