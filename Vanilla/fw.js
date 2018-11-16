/* 

CREATED BY: Michael Bolanos
FIRST VERSION: 2018-11-01

*/

/**************************************
*          FRAMEWORK VANILLA          *
***************************************/
class FW
{
	constructor()
	{
		// DO NOTHING
	}

	guid()
	{
		function s4()
		{
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	textAreaToClipboardReader(opts)
	{
		const self = this;

		if (opts.selector == undefined) throw ('You must include the property "selector"');
		if (opts.callback == undefined) throw ('You need include the property "callback" as a function');
		if (opts.hasHeaders == undefined) opts.hasHeaders = false;
		if (opts.rowSplit == undefined) opts.rowSplit = RegExp(/\r?\n/);
		if (opts.columnSplit == undefined) opts.columnSplit = '\t';

		let $element = document.querySelector(opts.selector);

		$element.placeholder = "Paste your data here..."

		$element.addEventListener('input', function ()
		{
			$element.placeholder = '...processing...';
			$element.readOnly = true;
			let temp = $element.value;
			$element.value = "";

			let json = self.jsonFromText(temp, {
				hasHeaders: opts.hasHeaders,
				rowSplit: opts.rowSplit,
				columnSplit: opts.columnSplit
			});

			// console.log(json);

			$element.readOnly = false;
			$element.placeholder = 'Paste your data here...';

			opts.callback(json);
		});
	}

	/**
	 * Get text data and try to create a JSON file
	 * @param {string} data string with all content
	 * @param {json} opts 
	 * rowSplit: char to split the rows
	 * columnSplit: char to split the columns
	 * hasHeaders: true or false
	 */
	jsonFromText(data, opts)
	{
		if (opts.rowSplit == undefined) opts.rowSplit = RegExp(/\r?\n/);
		if (opts.columnSplit == undefined) opts.columnSplit = '\t';
		if (opts.hasHeaders == undefined) opts.hasHeaders = false;

		let json = {};
		let header = undefined;
		let firstRow = true;

		data.split(opts.rowSplit).forEach(row =>
		{
			if (row == undefined || row == "") return;

			let rowData = {};
			let x = 0;

			row.split(opts.columnSplit).forEach(cell =>
			{
				if (opts.hasHeaders && !firstRow)
					rowData[header[x++]] = cell;
				else
					rowData[x++] = cell;
			});

			if (opts.hasHeaders && firstRow) header = rowData;
			else json[Object.keys(json).length] = rowData;

			firstRow = false;
		});

		return json;
	}
}

let fw = new FW();

/**************************************
                 MODAL                
***************************************

CONSTRUCTOR

header: 			html header of the dialog 
buttons: 			array with the buttons (Or include: value, class, content, img)
content: 			html content of the dialog 
callback: 			callback when the user press a button (Send: optionSelected, class)
onClose: 			callback when the user press the X button (Send the class)
onAfterRender:		callback after render the dialog (Send the class)

PROPS

*/
class fwvModal
{
	/**
	 * Call a modal dialog in the body of the current HTML document. Remember include in the <head> the meta <meta charset="UTF-8">.
	 * Only will display a dialog per time. If you require add another dialog the function will remove all others before tries to render a new one.
	 *
	 * @param {array} buttons An array with the options to show to the user. You can send a JSON with {class, value, content, img} for each button.
	 * @param {string} header Header to show in the dialog. You can send a JSON with {class, content}
	 * @param {string} message Message of the dialog (you can send anything in the message content, like divs, iframe or any kind of content).
	 * 		Accepts a JSON with {class, content}
	 * @param {function} callback function that's send the option selected by the user.
	 */
	constructor(opts)
	{

		if (opts.header == undefined) opts.header = 'Modal';
		if (opts.callback == undefined) console.log("ERROR: the callback on Modal is not defined");
		if (opts.buttons == undefined) throw ('Must include the property "buttons"');
		if (opts.content == undefined) throw ('Must include the property "content"');

		this.opts = opts;
		this.vars = {};
		this.id = 'modal-' + fw.guid();
	}

	render()
	{
		const self = this;
		const opts = self.opts;

		let $modal = document.querySelector('.fwv-modal');
		if ($modal != null) $modal.remove();

		if (typeof (opts.header) == "string")
			opts.header = { class: "", content: opts.header };

		if (typeof (opts.content) == "string")
			opts.content = { class: "", content: opts.content };

		let htmlButtons = "";

		opts.buttons.forEach(element =>
		{
			if (typeof (element) == "string")
				element = { class: "", img: "", value: element, content: element };

			if (element.img == "" || element.img == undefined)
				htmlButtons += `<button fwv-value='${element.value}' class='${element.class}'>${element.content}</button>`;
			else
				htmlButtons +=
					`<button fwv-value='${element.value}' class='${element.class}'>
						<div style='display:flex;align-items:center'>
							<img src="${element.img}"/>
							<span>${element.content}</span>
						</div>
					</button>`;
		});

		// Multiples ways to render a cross symbol
		// https://en.wikipedia.org/wiki/X_mark
		let htmlString = `
<div id='${self.id}' class="fwv-modal fwv-show-modal">
	<div class="fwv-modal-container">
		<div class='fwv-modal-header ${opts.header.class}'>${opts.header.content}</div>
		<span class="fwv-header-button fwv-move-button"><i class="fas fa-arrows-alt"></i></span>
		<span class="fwv-header-button fwv-close-button"><i class="fas fa-times"></i></span>

		<div class="fwv-modal-content ${opts.content.class}">${opts.content.content}</div>

		<div class="fwv-modal-section-buttons">
			<div class='fwv-btn-group-modal'>
				${htmlButtons}
			</div>
		</div>
	</div>
</div>`;

		// APPEND THE MODAL INFO INTO THE HTML BODY
		document.querySelector('body').insertAdjacentHTML("afterbegin", htmlString);

		if (self.opts.onAfterRender != undefined)
			self.opts.onAfterRender(self);

		document.querySelectorAll(`#${self.id} .fwv-btn-group-modal button`).forEach(btn =>
		{
			btn.addEventListener('click', (e) => 
			{
				self.opts.callback(btn.getAttribute('fwv-value'), self);
				self._toggle(e, self);
			});
		});

		// GET SELECTORS
		self.vars.$main = document.querySelector(`#${self.id}`);

		document.querySelector(`#${self.id} .fwv-close-button`).addEventListener('click', (e) => self._onClose(e, self));

		window.addEventListener("dblclick", (e) =>
		{
			if (event.target === self.vars.$main) self._toggle(e, self);
		});

		self._drag();
	}

	_onClose(e, self)
	{
		self._toggle(e, self);

		if (self.opts.onClose != undefined)
			self.opts.onClose(self);
	}

	_toggle(e, self)
	{
		self.vars.$main.classList.toggle("fwv-show-modal");
		self.vars.$main.remove();
	}

	_drag()
	{
		const self = this;

		self.vars.$modal = document.querySelector(`#${self.id} .fwv-modal-container`);
		self.vars.$modal.style.position = 'relative';

		document.querySelector(`#${self.id} .fwv-move-button`).addEventListener('mousedown', (e) =>
		{
			// console.log('Modal move - On');

			self.vars.X = e.srcElement.offsetLeft + 7;
			self.vars.Y = e.srcElement.offsetTop + 11;

			let _mouseMove = (e) => self._mouseMove(e, self)
			let _mouseUp = () =>
			{
				document.removeEventListener('mouseup', _mouseUp);
				document.removeEventListener('mousemove', _mouseMove);
			}

			document.addEventListener('mousemove', _mouseMove);
			document.addEventListener('mouseup', _mouseUp);
		});
	}

	_mouseMove(e, self)
	{
		try {
			// console.log('Modal move!', self, e);

			if (window.getSelection) {
				if (window.getSelection().empty) {  // Chrome
					window.getSelection().empty();
				} else if (window.getSelection().removeAllRanges) {  // Firefox
					window.getSelection().removeAllRanges();
				}
			} else if (document.selection) {  // IE?
				document.selection.empty();
			}

			self.vars.$modal.style.transform = "none";

			self.vars.$modal.style.left = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - self.vars.X;
			self.vars.$modal.style.top = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - self.vars.Y;
		} catch (error) {
			debugger;
		}
	}
}


/**************************************
           MULTIPLE SELECTION         
***************************************

CONSTRUCTOR

parent:				parent query selector
values: 			values on array
width:				width of the control
class:				additional class applicable on the element
showList:			show all items by default (true / false) - Default false
placeholder:		text of the place holder - default blank

PROPS

valuesSelected:		Values selected

*/
class fwvSelectMultiple
{
	constructor(opts)
	{
		opts.showList = opts.showList == undefined ? false : opts.showList;
		opts.width = opts.width == undefined ? '200px' : opts.width;
		opts.placeholder = opts.placeholder == undefined ? 'VALUES' : opts.placeholder;

		this.id = "multiple-" + fw.guid();
		this.opts = opts;
	}

	render()
	{
		const self = this;
		let customClasses = '';
		let btnClass = this.opts.showList ? 'fa-angle-up' : 'fa-angle-down';

		if (this.opts.class != undefined) customClasses = `class = '${this.opts.class}'`

		let html = `
			<div id='${this.id}' ${customClasses} style='width: ${this.opts.width}'>
				<div class='fwv-multipleSelectContent'>
					<input type='text' class='fwv-multipleContent' placeholder='${this.opts.placeholder}' readonly>
					<div class='fwv-multipleSelectOptions'><i class="fas ${btnClass} fa-lg"></i></div>
				</div>
			</div>`;

		this.$parent = document.querySelector(`${this.opts.parent}`);
		this.$parent.insertAdjacentHTML('beforeEnd', html);
		this.$main = document.querySelector(`#${this.id}`);

		this.$txtContent = document.querySelector(`#${this.id} .fwv-multipleContent`);
		this.$btnOptions = document.querySelector(`#${this.id} .fwv-multipleSelectOptions`);

		let htmlSelectValues = this.$txtContent.value.split(',');
		let htmlContent = '';
		let isCheckedAll = 'checked';

		this.opts.values.forEach((val, index) =>
		{
			let isChecked = '';

			if (htmlSelectValues.indexOf(val) > -1)
				isChecked = 'checked';
			else
				isCheckedAll = '';

			htmlContent += `<input class='fwv-opt' type="checkbox" ${isChecked} value="${val}">${val}</input><br>`;
		});

		htmlContent = `<input class="fwv-opt-all" type="checkbox" ${isCheckedAll} value="Select all">Select all</input><hr/> ${htmlContent}`;

		this.$main.insertAdjacentHTML('beforeEnd', `<div class="fwv-mutipleSelectOptionContainer">${htmlContent}</div>`);

		this.$cmbOptions = document.querySelector(`#${this.id} .fwv-mutipleSelectOptionContainer`);
		this.$optAll = document.querySelector(`#${this.id} .fwv-opt-all`);
		this.$optsSingle = document.querySelectorAll(`#${this.id} .fwv-opt`);

		this._handleSelectAll();
		this._handleSelectSingle();

		self.$cmbOptions.style.visibility = this.opts.showList ? 'visible' : 'hidden';

		this.$btnOptions.addEventListener('click', () =>
		{
			let $icon = self.$btnOptions.querySelector('i');

			if ($icon.classList.contains('fa-angle-up')) {
				$icon.classList.replace('fa-angle-up', 'fa-angle-down');
				self.$cmbOptions.style.visibility = 'hidden';
			}
			else {
				$icon.classList.replace('fa-angle-down', 'fa-angle-up');
				self.$cmbOptions.style.visibility = 'visible';
			}
		});
	}

	_handleSelectAll()
	{
		const self = this;

		this.$optAll.addEventListener('click',
			(e) =>
			{
				let selectAll = e.srcElement.checked;

				self.$optsSingle
					.forEach(
						(e, i) => e.checked = selectAll
					);

				self._checkItems();
			}
		);
	}

	_handleSelectSingle()
	{
		const self = this;

		this.$optsSingle
			.forEach((e, i) =>
				e.onclick = (e) =>
				{
					self._checkItems();
				});
	}

	_checkItems()
	{
		let values = '';
		let selectAll = true;

		const self = this;

		this.$optsSingle
			.forEach(
				(e, i) =>
				{
					values += (e.checked ? e.value + "," : "");

					if (!e.checked) selectAll = false;
				});

		this.$optAll.checked = selectAll;
		this.$txtContent.value = values.substring(0, values.length - 1);
		this.valuesSelected = this.$txtContent.value;
	}
};