const Gio = imports.gi.Gio;

const AppDisplay = imports.ui.appDisplay;
const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const Me = ExtensionUtils.getCurrentExtension();

const EXTENSION_SCHEMA = 'org.gnome.shell.extensions.app-grid-columns';
const COLUMNS_KEY = 'columns';

const GNOME_DEFAULT_COLUMNS = 6;

class Extension {

	constructor() {
		log(`initializing ${Me.metadata.name} version ${Me.metadata.version}`);
	}

	enable() {
		log(`enabling ${Me.metadata.name} version ${Me.metadata.version}`);

		let gschema = Gio.SettingsSchemaSource.new_from_directory(
			Me.dir.get_child('schemas').get_path(),
			Gio.SettingsSchemaSource.get_default(),
			false,
		);

		this.settings = new Gio.Settings({
			settings_schema: gschema.lookup(
				EXTENSION_SCHEMA,
				true,
			),
		});

		this.columns = this.settings.get_int(COLUMNS_KEY);

		this._onColumnsChangedId = this.settings.connect(
			`changed::${COLUMNS_KEY}`,
			this._onColumnsChanged,
		);

		this._onColumnsChanged();
	}

	disable() {
		log(`disabling ${Me.metadata.name} version ${Me.metadata.version}`);

		this.settings.disconnect(this._onColumnsChangedId);

		this._udpateColumns(GNOME_DEFAULT_COLUMNS);
	}

	_onColumnsChanged() {
		this.columns = this.settings.get_int(COLUMNS_KEY);
		this._udpateColumns(this.columns);
	}

	_udpateColumns(columns) {
		Main.overview.viewSelector.appDisplay._views[AppDisplay.Views.ALL].view._grid._colLimit = columns;
		Main.overview.viewSelector.appDisplay._views[AppDisplay.Views.FREQUENT].view._grid._colLimit = columns;

		Main.overview.viewSelector.appDisplay._views[AppDisplay.Views.ALL].view._redisplay();
		Main.overview.viewSelector.appDisplay._views[AppDisplay.Views.FREQUENT].view._redisplay();

		log(`Displaying ${columns} columns in the App Grid}`);
	}
}

function init() {
	return new Extension();
}
