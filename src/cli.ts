#!/usr/bin/env node

import { Command } from 'commander';
import { cloneProfile, cleanupProfile } from './cloneProfile.js';
import { launchBrowserWithFixedProfile } from './launchBrowser.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as os from 'os';
import chalk from 'chalk';

interface CloneOptions {
  verbose?: boolean;
}

interface LaunchOptions {
  verbose?: boolean;
  headless?: boolean;
  noExtensions?: boolean;
}

interface CleanOptions {
  verbose?: boolean;
  force?: boolean;
}

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get version
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

const program = new Command();

program
  .name('profile-cloner')
  .description('A tool for cloning browser profiles using Puppeteer')
  .version(packageJson.version);

program
  .command('clone')
  .description('Clone the Chrome Default profile to a destination directory')
  .argument('[dest]', 'Destination path for the cloned profile', join(os.homedir(), 'AutomationProfile'))
  .option('-v, --verbose', 'Enable verbose output')
  .addHelpText('after', `
Examples:
  $ profile-cloner clone                    Clone to default location (~/AutomationProfile)
  $ profile-cloner clone ./my-profile       Clone to a custom directory
  $ profile-cloner clone /tmp/test-profile  Clone to an absolute path`)
  .action(async (dest: string, options: CloneOptions) => {
    try {
      if (options.verbose) {
        console.log(chalk.blue(`Cloning Chrome profile to: ${dest}`));
      }
      
      await cloneProfile(dest);
      console.log(chalk.green('✓ Profile cloning completed successfully'));
    } catch (error) {
      console.error(chalk.red('✗ Failed to clone profile:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('launch')
  .description('Clone the Chrome profile and launch browser with Puppeteer')
  .argument('[dest]', 'Destination path for the cloned profile', join(os.homedir(), 'AutomationProfile'))
  .option('-v, --verbose', 'Enable verbose output')
  .option('--headless', 'Launch browser in headless mode')
  .option('--no-extensions', 'Disable browser extensions')
  .addHelpText('after', `
Examples:
  $ profile-cloner launch                   Clone and launch browser with default profile location
  $ profile-cloner launch ./my-profile      Clone to custom directory and launch browser
  $ profile-cloner launch --headless        Launch browser in headless mode`)
  .action(async (dest: string, options: LaunchOptions) => {
    try {
      if (options.verbose) {
        console.log(chalk.blue(`Cloning Chrome profile to: ${dest}`));
        console.log(chalk.blue('Launching browser...'));
      }

      // Configure launch options based on CLI flags
      const launchOptions: Record<string, unknown> = {};
      
      if (options.headless) {
        launchOptions.headless = true;
      }
      
      if (options.noExtensions) {
        launchOptions.ignoreDefaultArgs = ['--disable-extensions'];
        launchOptions.args = ['--disable-extensions'];
      }

      const browser = await launchBrowserWithFixedProfile(dest, launchOptions);
      
      console.log(chalk.green('✓ Browser launched successfully'));
      console.log(chalk.yellow('Press Ctrl+C to close the browser and exit'));
      
      // Keep the process alive until the browser is closed or process is terminated
      process.on('SIGINT', async () => {
        console.log(chalk.blue('\nClosing browser...'));
        try {
          await browser.close();
          console.log(chalk.green('✓ Browser closed successfully'));
        } catch (error) {
          console.error(chalk.red('✗ Error closing browser:'), error instanceof Error ? error.message : String(error));
        }
        process.exit(0);
      });

      // Wait for browser to be disconnected
      browser.on('disconnected', () => {
        console.log(chalk.blue('Browser disconnected'));
        process.exit(0);
      });

    } catch (error) {
      console.error(chalk.red('✗ Failed to launch browser:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('clean')
  .description('Delete the cloned profile folder')
  .argument('[dest]', 'Path to the profile folder to delete', join(os.homedir(), 'AutomationProfile'))
  .option('-v, --verbose', 'Enable verbose output')
  .option('-f, --force', 'Force deletion without confirmation')
  .addHelpText('after', `
Examples:
  $ profile-cloner clean                    Delete the default profile location (~/AutomationProfile)
  $ profile-cloner clean ./my-profile       Delete a custom profile directory
  $ profile-cloner clean -f                 Force delete without confirmation`)
  .action(async (dest: string, options: CleanOptions) => {
    try {
      if (!options.force) {
        // Simple confirmation (in a real CLI you might want to use a proper prompt library)
        console.log(chalk.yellow(`About to delete profile folder: ${dest}`));
        console.log(chalk.yellow('This action cannot be undone.'));
        console.log(chalk.blue('Run with --force flag to skip this confirmation.'));
        
        // For now, we'll require the --force flag for deletion
        console.log(chalk.red('Use --force flag to confirm deletion.'));
        process.exit(1);
      }

      if (options.verbose) {
        console.log(chalk.blue(`Deleting profile folder: ${dest}`));
      }
      
      await cleanupProfile(dest);
      console.log(chalk.green('✓ Profile cleanup completed successfully'));
    } catch (error) {
      console.error(chalk.red('✗ Failed to clean profile:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Show help if no command is provided
if (process.argv.length <= 2) {
  program.help();
}

program.parse();
