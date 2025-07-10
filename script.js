// Este evento espera a página inteira (incluindo outros scripts) carregar completamente.
window.addEventListener('load', function() {
	
	console.log("PÁGINA CARREGADA. A SOBRESCREVER FUNÇÕES AGORA...");

	/**
	 * Função para AUMENTAR a quantidade de complementos.
	 * Esta definição irá substituir a original da plataforma.
	 */
	function increaseComplementAmount({ complement }) {
		const tituloElemento = document.getElementById('complement-step-title');
		const tituloAtual = tituloElemento ? tituloElemento.innerText.trim() : '';
		const titulosExcluidos = ["Escolha 10 salgados", "Escolha o sabor"];
		let step = 5;

		if (titulosExcluidos.includes(tituloAtual)) {
			step = 1;
		}

		const { id: complementId, title: complementTitle, price: complementPrice } = complement;
		const { selectedComplements, currentPage } = complementStepState;
		const currentComplementStep = complementStepState.complementSteps[currentPage - 1];

		if (advancedBehavior) {
			const nextBtn = document.getElementById('complement-' + complement.id).nextElementSibling;
			if (nextBtn?.classList.contains('d-none') ?? false) return;
		}

		const selectedComplementOfPageIsCreated = getSelectedComplementsOfCurrentPage();
		if (!selectedComplementOfPageIsCreated) {
			selectedComplements.push({
				title: currentComplementStep.title,
				page: currentPage,
				complements: [],
			})
		}

		const currentSelectedComplements = getSelectedComplementsOfCurrentPage();
		const alreadyChoosedComplement = currentSelectedComplements.complements
			.find(complement => complement.id === complementId);

		if (!alreadyChoosedComplement) {
			currentSelectedComplements.complements.push({
				id: complementId,
				price: complementPrice,
				amount: step,
				title: complementTitle,
			})
			if (advancedBehavior) {
				const complementInfo = document.getElementById('complement-' + complementId);
				complementInfo.previousElementSibling.classList.remove('d-none');
				complementInfo.classList.remove('d-none');
			}
		} else {
			alreadyChoosedComplement.amount = alreadyChoosedComplement.amount + step;
		}

		changeComplementInputAmountValue({
			inputId: 'complement-' + complementId,
			value: alreadyChoosedComplement ? alreadyChoosedComplement.amount : step,
		});

		isValidToProgress();
	}

	/**
	 * Função para DIMINUIR a quantidade de complementos.
	 * Esta definição também irá substituir a original.
	 */
	function decreaseComplementAmount({ complement }) {
		const tituloElemento = document.getElementById('complement-step-title');
		const tituloAtual = tituloElemento ? tituloElemento.innerText.trim() : '';
		const titulosExcluidos = ["Escolha 10 salgados", "Escolha o sabor"];
		let step = 5;

		if (titulosExcluidos.includes(tituloAtual)) {
			step = 1;
		}

		const { id: complementId } = complement;
		const currentSelectedComplements = getSelectedComplementsOfCurrentPage();
		if (!currentSelectedComplements) return

		const alreadyChoosedComplement = currentSelectedComplements.complements
			.find(complement => complement.id === complementId);
		if (!alreadyChoosedComplement) return;

		alreadyChoosedComplement.amount = alreadyChoosedComplement.amount - step;

		if (alreadyChoosedComplement.amount <= 0) {
			currentSelectedComplements.complements = currentSelectedComplements.complements
				.filter(complement => complement.id !== complementId);
			if (advancedBehavior) {
				const complementInfo = document.getElementById('complement-' + complementId);
				complementInfo.previousElementSibling.classList.add('d-none');
				complementInfo.classList.add('d-none');
			}
		}

		const finalAmount = Math.max(0, alreadyChoosedComplement.amount);

		changeComplementInputAmountValue({
			inputId: 'complement-' + complementId,
			value: finalAmount,
		});

		if (complement.supply_control) {
			decreaseComplementSupplyStore({ complementId: complementId, amount: step });
		}

		isValidToProgress();
	}
});