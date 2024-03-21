#!/bin/bash

gnome-terminal --working-directory=server/ms-auth/ -- npm run dev
gnome-terminal --working-directory=server/ms-offre/ -- npm run dev
gnome-terminal --working-directory=server/blockchain/ -- npm run dev
gnome-terminal --working-directory=server/ms-gateway/profferGateway/ -- npm start
gnome-terminal --working-directory=client/ -- npm run dev