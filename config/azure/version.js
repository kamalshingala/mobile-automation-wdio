const appsFolder = './apps/';
const fs = require('fs');
const { capabilities } = require('config-yml');

const getAppsProperties = isGetName => {
  let property = '';
  const folder = `${appsFolder}${getReleaseVersion()}`;
  fs.readdirSync(folder).forEach(file => {
    if (file.includes('_v')) {
      if (!isGetName) {
        const name = file.split('_');
        [, property] = name;
        property = property.replace('.zip', '');
        return property;
      }
      property = file;
    }
  });
  return property;
};

const getInstallerFilePath = type => {
  let path = '';
  const version = getReleaseVersion();
  const folder = `${appsFolder}${version}`;
  let fileName = '';
  console.log(`Folder to file installer: ${folder}`);
  fs.readdirSync(folder).forEach(file => {
    console.log(`Each file: ${file}`);
    if (file.toLowerCase().includes(type.toLowerCase())) {
      fileName = file;
      path = `${folder}/${file}`;
    }
  });

  console.log(`After getting fileName: ${fileName}`);
  if (fileName === '') {
    path = type.includes('android')
      ? capabilities.android.installerFile
      : capabilities.ios.installerFile;
  }

  console.log(`Installer path: ${path}`);
  return path;
};

const getReleaseVersion = () => {
  let releaseVersion = '';
  // If the variable is available from pipeple return it
  if (process.env.RELEASE_VERSION !== undefined) {
    console.log(`Pipeline version variable FOUND: ${process.env.RELEASE_VERSION}`);
    return process.env.RELEASE_VERSION;
  }

  fs.readdirSync(appsFolder).forEach(file => {
    if (file.includes('v')) {
      releaseVersion = file;
      console.log(`File version: ${releaseVersion}`);
    }
  });
  return releaseVersion;
};

exports.getAppsProperties = getAppsProperties;
exports.getReleaseVersion = getReleaseVersion;
exports.getInstallerFilePath = getInstallerFilePath;
