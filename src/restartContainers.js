const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

async function getConfiguration() {
  const configFilePath = path.join(__dirname, 'config.json');
  let config;

  try {
    config = await fs.readJson(configFilePath);
    console.log('Configuration file read successfully.');
  } catch (error) {
    console.warn('No existing configuration found. Starting fresh.');
    config = {};
  }

  if (!config.appsDirectory) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'appsDirectory',
        message: 'Enter the path to your apps directory:',
        validate: (input) =>
          fs.existsSync(input) ||
          'Directory does not exist, please enter a valid directory path.',
      },
    ]);

    config.appsDirectory = answers.appsDirectory;
    console.log('Generating containers list...');
    config.containersList = await getContainersList(config.appsDirectory);
    await fs.writeJson(configFilePath, config);
    console.log('Configuration saved successfully.');
  } else if (!config.containersList) {
    console.log('Generating containers list...');
    config.containersList = await getContainersList(config.appsDirectory);
    await fs.writeJson(configFilePath, config);
    console.log('Containers list saved successfully.');
  }

  return config;
}

async function getContainersList(appsDirectory) {
  const excludeDirs = ['.vscode', '.git', 'node_modules'];
  try {
    console.log(`Reading apps directory at: ${appsDirectory}`);
    const dirs = await fs.readdir(appsDirectory, { withFileTypes: true });
    const containers = dirs
      .filter(
        (dirent) => dirent.isDirectory() && !excludeDirs.includes(dirent.name)
      )
      .map((dirent) => dirent.name);
    console.log(`Found containers: ${containers.join(', ')}`);
    return containers;
  } catch (error) {
    console.error('Error reading apps directory:', error);
    return [];
  }
}

async function main() {
  const { appsDirectory, containersList } = await getConfiguration();

  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'containers',
      message: 'Select the containers to restart or press Enter to select all:',
      choices: containersList,
      default: containersList,
    },
    {
      type: 'list',
      name: 'action',
      message: 'Choose the action to perform:',
      choices: ['make', 'start', 'down', 'build'],
    },
    {
      type: 'confirm',
      name: 'verbose',
      message: 'Do you want verbose output?',
      default: true,
    },
  ]);

  for (const container of answers.containers) {
    await restartContainer(appsDirectory, container, answers.action, answers.verbose);
  }
}

async function restartContainer(appsDirectory, container, action, verbose) {
  const containerDir = path.join(appsDirectory, container);
  console.log(`Attempting action: ${action} on ${container}`);

  let command = 'docker-compose';
  let args = [];

  switch (action) {
    case 'make':
      command = 'make';
      args = [];
      break;
    case 'start':
      args = ['up', '-d'];
      break;
    case 'down':
      args = ['down'];
      break;
    case 'build':
      args = ['up', '-d', '--build'];
      break;
  }

  const child = spawn(command, args, { cwd: containerDir, stdio: verbose ? 'inherit' : 'pipe' });

  child.on('close', (code) => {
    if (code === 0) {
      console.log(`Action completed successfully for ${container}`);
    } else {
      console.error(`Error with ${container}: Process exited with code ${code}`);
    }
  });
}

main().catch((err) => console.error(err));
