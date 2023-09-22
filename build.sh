# check if ~/.bun exists
if (! command -v bun &> /dev/null) || [ ! -d ~/.bun ]; then

    bash_configs=(
        "$HOME/.bashrc"
        "$HOME/.bash_profile"
    )

    curl -fsSL https://bun.sh/install | bash 
    
    # execute source command for all existing bash configs
    for bash_config in "${bash_configs[@]}"; do
        if [ -f "$bash_config" ]; then
            source "$bash_config"
        fi
    done
fi

(cd packages/connector && bun install && bun run build)
(cd packages/app && bun install &&  bun run build && bun run build-studio && bun run server)