#!/bin/bash

fzf_preview='([[ -f {} ]] && (bat -pp --color=always {} || cat {})) || ([[ -d {} ]] && (tree -C {} | less)) || echo {} 2> /dev/null | head -200'
# fzf_color='bg:#000018,bg+:#002222,border:#006B6B,spinner:#98BC99,header:#55FFFF'
fzf_color="''"
fzf_header="Select one or more file keys"
fzf_options="--multi --preview-window=right:hidden:wrap --info=inline --ansi -p 80%"
# --info=default, inline, hidden --pointer=">" --marker=">" --header="", --header-lines=N
# --{q} query string, {n} line index, {+n} all lines indexes

content=$(FORCE_COLOR=2 node /home/nicholas/projects/personal/wikiscan/lib/index.js)
selected=$(\
  echo -e "$content" | fzf-tmux \
    $FZF_TMUX_OPTS \
    --header="${fzf_header}" \
    --preview='bat -pp --color=always {1}' \
    --query="$1" \
    ${fzf_options} \
    --nth=1 \
    --with-nth=2.. \
  | cut -d' ' -f1
)

output_file() {
  nc='\033[0m'
  # clr_red='\e[38;5;111m'
  clr_red='\033[38;2;220;100;80m'
  file=$1
  pager_cmd="$HOME/.local/bin/nvimpager -c $file"
  echo -e "\n\n$clr_red -- ${file//$HOME/~} -- $nc"
  eval "$pager_cmd" | sed '1,4d'
}

export -f output_file
echo "${selected[@]}" | awk '{ print $1 }' | xargs -I{} bash -c 'output_file {}'
# echo -e "---\nFinished: $(echo "'${selected[*]}'" | wc -l) matching files"

