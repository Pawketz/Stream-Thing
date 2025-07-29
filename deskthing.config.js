// @ts-check
// version 0.11.12
import { defineConfig } from '@deskthing/cli';
import dotenv from 'dotenv';

dotenv.config()


export default defineConfig({
  development: {
    logging: {
      level: "debug",
      prefix: "[DeskThing Server]",
    },
    client: {
      logging: {
        level: "debug",
        prefix: "[DeskThing Client]",
        enableRemoteLogging: true,
      },
      clientPort: 3000,
      viteLocation: "http://localhost",
      vitePort: 5173,
      linkPort: 8080,
    },
    server: {
      editCooldownMs: 1000,
      mockData: {
        settings: {
          host: process.env.OBS_HOST, // uses environment variables for the settings - ensuring they stay secured per-machine
          port: process.env.OBS_PORT,
          password: process.env.OBS_PASSWORD,
        }
      }
    },
  }
});
  