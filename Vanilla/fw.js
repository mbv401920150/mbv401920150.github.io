

class FW {
	constructor() {
		// DO NOTHING
	}

	jsonFromText(data, hasHeaders, rowSplit, columnSplit) {
		if (rowSplit == undefined) rowSplit = /\r?\n/;
		if (columnSplit == undefined) columnSplit = '\t';

		debugger;

		let json = {};
		let firstRow = true;
		let header = undefined;
		if (hasHeaders == undefined) hasHeaders = false;


		data.split(rowSplit).forEach(row => {
			if (row == undefined || row == "") return;

			let rowData = {};
			let x = 0;

			row.split(columnSplit).forEach(cell => {
				if (hasHeaders && !firstRow)
					rowData[header[x++]] = cell;
				else
					rowData[x++] = cell;
			});

			if (hasHeaders && firstRow) header = rowData;
			else json[Object.keys(json).length] = rowData;

			firstRow = false;
		});

		return json;
	}




}

// STATIC CLASS
class fwvModal {
	constructor() {
		this.vars = {};
	}

	/**
		 * Call a modal dialog in the body of the current HTML document. Remember include in the <head> the meta <meta charset="UTF-8">.
		 * Only will display a dialog per time. If you require add another dialog the function will remove all others before tries to render a new one.
		 *
		 * @author: Michael Bolanos
		 *
		 * @param {array} buttons An array with the options to show to the user. You can send a JSON with {class, value, content, img} for each button.
		 * @param {string} header Header to show in the dialog. You can send a JSON with {class, content}
		 * @param {string} message Message of the dialog (you can send anything in the message content, like divs, iframe or any kind of content).
		 * 		Accepts a JSON with {class, content}
		 * @param {function} callback function that's send the option selected by the user.
		 */
	show(buttons, header, message, callback) {
		const self = this;

		let modal = document.querySelector('.fwv-modal');
		if (modal != null) modal.remove();

		if (typeof (header) == "string")
			header = { class: "", content: header };

		if (typeof (message) == "string")
			message = { class: "", content: message };

		let htmlButtons = "";

		buttons.forEach(element => {
			if (typeof (element) == "string")
				element = { class: "", img: "", value: element, content: element };

			if (element.img == "")
				htmlButtons += `<button fwv-value='${element.value}' class='${element.class}'>${element.content}</button>`;
			else
				htmlButtons +=
					`<button fwv-value='${element.value}' class='${element.class}'>
            <div style='display:flex;align-items:center;'>
              <img src="${element.img}">
              <span>${element.content}</span>
            </div>
          </button>`;
		});

		// Multiples ways to render a cross symbol
		// https://en.wikipedia.org/wiki/X_mark

		let htmlString = `<div class="fwv-modal fwv-show-modal">
  <div class="fwv-modal-container">
    <div class='fwv-modal-header ${header.class}'>${header.content}</div>
    <span class="fwv-header-button fwv-move-button">⁜</span>
		<span class="fwv-header-button fwv-close-button">🗙</span>
    <div class="fwv-modal-content ${message.class}">${message.content}</div>
    <div class="fwv-modal-section-buttons">
      <div class='fwv-btn-group-modal'>
        ${htmlButtons}
      </div>
    </div>
  </div>
</div>`;

		// APPEND THE MODAL INFO INTO THE HTML BODY
		document.querySelector('body').insertAdjacentHTML("afterbegin", htmlString);

		// GET SELECTORS
		self.vars.main = document.querySelector(".fwv-modal");
		document.querySelector(".fwv-close-button").click(self.fwvModalTogglePrivate);

		window.addEventListener("dblclick", (e) => {
			if (event.target === self.vars.main) self.fwvModalTogglePrivate();
		});

		document.querySelectorAll(".fwv-btn-group-modal button").forEach(e => e.addEventListener('click', self.fwvModalTogglePrivate));

		self.fwvModalDragPrivate();
	}

	fwvModalTogglePrivate(e) {
		this.vars.main.classList.toggle("fwv-show-modal");
		document.querySelector('.fwv-modal').remove();

		if (e != undefined && e.currentTarget.tagName == 'BUTTON' && typeof (callback) == 'function')
			callback(e.srcElement.getAttribute('fwv-value'));
	}

	fwvModalDragPrivate() {
		const self = this;

		self.vars.$modal = document.querySelector('.fwv-modal-container');
		self.vars.$modal.style.position = 'relative';

		document.querySelector('.fwv-move-button').addEventListener('mousedown', (e) => {
			// console.log('Modal move - On');

			self.vars.X = e.srcElement.offsetLeft + 11;
			self.vars.Y = e.srcElement.offsetTop + 11;

			let _mouseMove = (e) => self.eventMouseMove(e, self)
			let _mouseUp = () => {
				document.removeEventListener('mouseup', _mouseUp);
				document.removeEventListener('mousemove', _mouseMove);
			}

			document.addEventListener('mousemove', _mouseMove);
			document.addEventListener('mouseup', _mouseUp);
		});
	}

	eventMouseMove(e, self) {
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

class fwvSelectMultiple {
	constructor(id, parent, values, width) {
		width = width == undefined ? '200px' : width;

		let html = `<div id='${id}' style='width: ${width}'>
				<div class='fwv-multipleSelectContent'>
					<input type='text' class='fwv-multipleContent' readonly>
					<div class='fwv-multipleSelectOptions'><i class="fas fa-angle-down fa-lg"></i></div>
				</div>
			</div>`;

		parent.insertAdjacentHTML('beforeEnd', html);

		this.id = id;
		this.values = values;
		this.$parent = document.querySelector(`#${id}`);
		this.$txtContent = document.querySelector(`#${id} div .fwv-multipleContent`);
		this.$btnOptions = document.querySelector(`#${id} div .fwv-multipleSelectOptions`);
		this.$btnOptions.onclick = this.show.bind(this);
	}

	show() {
		let htmlSelectValues = this.$txtContent.value.split(',');
		let htmlContent = '';
		let isCheckedAll = 'checked';

		this.values.forEach((val, index) => {
			let isChecked = '';

			if (htmlSelectValues.indexOf(val) > -1)
				isChecked = 'checked';
			else
				isCheckedAll = '';

			htmlContent += `<input class='fwv-opt' type="checkbox" ${isChecked} value="${val}">${val}</input><br>`;
		});

		htmlContent = `<input class="fwv-opt-all" type="checkbox" ${isCheckedAll} value="Select all">Select all</input><hr/> ${htmlContent}`;

		this.$parent.insertAdjacentHTML('beforeEnd', `<div class="fwv-mutipleSelectOptionContainer">${htmlContent}</div>`);

		this.$cmbOptions = document.querySelector(`#${this.id} .fwv-mutipleSelectOptionContainer`);
		this.$optAll = document.querySelector(`#${this.id} .fwv-opt-all`);
		this.$optsSingle = document.querySelectorAll(`#${this.id} .fwv-opt`);

		this.handleSelectOption();
		this.handleSelectAll();
		this.handleSelectSingle();
	}

	handleSelectOption() {
		this.$btnOptions.innerHTML = '<i class="fas fa-angle-up fa-lg"></i>';

		(this.$btnOptions.onclick = () => {
			this.$btnOptions.innerHTML = '<i class="fas fa-angle-down fa-lg"></i>';
			this.$btnOptions.onclick = this.show.bind(this);

			this.$cmbOptions.parentNode.removeChild(this.$cmbOptions);
		}).bind(this);
	}

	handleSelectAll() {
		const self = this;

		this.$optAll
			.onclick = (e) => {
				let selectAll = e.srcElement.checked;

				this.$optsSingle
					.forEach(
						(e, i) => e.checked = selectAll
					);

				self.checkItems();
			};
	}

	handleSelectSingle() {
		const self = this;

		this.$optsSingle
			.forEach((e, i) =>
				e.onclick = (e) => {
					self.checkItems();
				});
	}

	checkItems() {
		let values = '';
		let selectAll = true;

		const self = this;

		this.$optsSingle
			.forEach(
				(e, i) => {
					values += (e.checked ? e.value + "," : "");

					if (!e.checked) selectAll = false;
				});

		this.$optAll.checked = selectAll;
		this.$txtContent.value = values.substring(0, values.length - 1);
		this.valuesSelected = this.$txtContent.value;
	}
};