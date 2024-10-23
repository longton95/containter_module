# Container Module CLI

This is a CLI tool for managing multiple Docker containers in your apps directory. It helps streamline common container operations such as restarting, building, and performing git pulls on the repositories.

## Features

- **Interactive Command Line Interface**: Uses prompts to guide the user through selecting which containers to operate on.
- **Actions Available**:
  - `make` to run Makefiles in each container directory.
  - `start` to start containers using Docker Compose.
  - `down` to stop containers.
  - `build` to build and start containers.
  - `git pull` to pull the latest changes for each container.
  - `lazy option` to automatically pull the latest changes and run `make` in each repository.
- **Configuration Persistence**: Stores your apps directory path in a configuration file for future use.

## Installation

1. Install the package globally using npm:

   ```sh
   npm install -g https://github.com/longton95/container_module.git
   ```

2. Once installed globally, you can run the CLI tool from anywhere in your system:

   ```sh
   container-module
   ```

## Installation (Local Development)

If you prefer local development, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/longton95/container_module.git
   ```

2. Navigate to the project directory:

   ```sh
   cd container_module
   ```

3. Install the dependencies:

   ```sh
   npm install
   ```

## Usage

After installing globally, you can run the tool from anywhere:

```sh
container-module
```

### Configuration

The first time you run the CLI, you will be prompted to enter the path to your apps directory, where all the container directories reside. This path will be saved in `config.json` for future use.

### Available Commands

- **Select Containers**: You will be asked to select which containers to act upon (or press Enter to select all).
- **Choose Action**: Choose an action to perform:
  - `make`: Run the Makefile in each selected container.
  - `start`: Start Docker containers in the background.
  - `down`: Stop Docker containers.
  - `build`: Build Docker containers and start them in the background.
  - `git pull`: Pull the latest changes for each repository.
  - `lazy option`: Pull the latest changes and run `make` in each container directory (JUST FOR THE DB GUYS).

### Example

```sh
container-module
```

- **Select the containers** you wish to restart.
- \*\*Choose \*\***`lazy option`** if you want to pull the latest changes and automatically run `make` on all selected containers.

## Notes

- The tool will save your selected apps directory and container list in a configuration file (`config.json`) in the root of the project.
- Verbose output is available as an option, providing more detailed logs of each command executed.
- Excluded directories include `.vscode`, `.git`, and `node_modules` to ensure only valid container directories are managed.

## License

MIT License
