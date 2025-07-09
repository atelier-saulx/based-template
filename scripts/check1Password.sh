if command -v "op" &>/dev/null; then
  exit 0
else
  printf "1Password CLI not found.\nFollow instructions on the link bellow and signin to your account in the desktop app.\nhttps://developer.1password.com/docs/cli/get-started\n"
  exit 1
fi
