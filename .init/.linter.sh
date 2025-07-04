#!/bin/bash
cd /home/kavia/workspace/code-generation/wildsketch-arena-107269-2d04e7fb/drawing_game_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

