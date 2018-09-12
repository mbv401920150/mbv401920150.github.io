class fwvSelectMultiple {
		constructor(id, parent, values, width) {
			width = width == undefined ? '200px' : width;

			let html = `<div id='${id}' style='width: ${width}'>
				<div class='fwv-multipleSelectContent'>
					<input type='text' class='fwv-multipleContent' readonly>
					<div class='btnOptions'><i class="fas fa-angle-down fa-lg"></i></div>
				</div>
			</div>`;

			parent.insertAdjacentHTML('beforeEnd', html);

			this.id = id;
			this.values = values;
			this.$parent = document.querySelector(`#${id}`);
			this.$txtContent = document.querySelector(`#${id} div .fwv-multipleContent`);
			this.$btnOptions = document.querySelector(`#${id} div .btnOptions`);
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
			const _this = this;

			this.$optAll
				.onclick = (e) => {
					let selectAll = e.srcElement.checked;

					this.$optsSingle
						.forEach(
							(e, i) => e.checked = selectAll
						);

					_this.checkItems();
				};
		}

		handleSelectSingle() {
			const _this = this;

			this.$optsSingle
				.forEach((e, i) =>
					e.onclick = (e) => {
						_this.checkItems();
					});
		}

		checkItems() {
			let values = '';
			let selectAll = true;

			const _this = this;

			this.$optsSingle
				.forEach(
					(e, i) => {
						values += (e.checked ? e.value + "," : "");

						if (!e.checked) selectAll = false;
					});

			this.$optAll.checked = selectAll;
			this.$txtContent.value = values.substring(0, values.length - 1);
		}
	};