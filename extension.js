const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

class Extension {

	constructor() {
		log(`initializing ${Me.metadata.name} version ${Me.metadata.version}`);
	}

	enable() {
		log(`enabling ${Me.metadata.name} version ${Me.metadata.version}`);
	}

	disable() {
		log(`disabling ${Me.metadata.name} version ${Me.metadata.version}`);
	}
}

function init() {
	return new Extension();
}
