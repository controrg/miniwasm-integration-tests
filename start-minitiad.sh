#!/bin/sh

if [ -f /root/.minitia/config/genesis.json ]; then
  echo "genesis.json found. Skipping initialization commands..."
else
  echo "genesis.json not found. Running initialization commands..."
  minitiad init operator --chain-id testnet &&
  minitiad keys add operator --keyring-backend test &&
  minitiad genesis add-genesis-account init1j65sfxpkpstety502upxk0t6xhvcuclxawpqt8 1000000000000000umin --keyring-backend test &&
  minitiad genesis add-genesis-validator operator --keyring-backend test &&
  minitiad start
fi

echo "Starting minitiad..."
minitiad start
