function increaseComplementAmount({ complement }) {
	// --- LÓGICA CONDICIONAL INSERIDA AQUI ---
	// Define o passo (1 ou 5) com base no ID do produto.
	let step = 5;
	if (complementStepState.product.id === 1851076) {
		step = 1;
	}
	// --- FIM DA LÓGICA CONDICIONAL ---

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
			amount: step, // Usa a variável 'step'
			title: complementTitle,
		})
		if (advancedBehavior) {
			const complementInfo = document.getElementById('complement-' + complementId);
			complementInfo.previousElementSibling.classList.remove('d-none');
			complementInfo.classList.remove('d-none');
		}
	} else {
		alreadyChoosedComplement.amount = alreadyChoosedComplement.amount + step; // Usa a variável 'step'
	}

	changeComplementInputAmountValue({
		inputId: 'complement-' + complementId,
		value: alreadyChoosedComplement ? alreadyChoosedComplement.amount : step,
	})

	if (complement.supply_control) {
		increaseComplementSupplyStore({ complementId: complement.id })
		const productComplementWithSupply = complementHasSupply({
			complement,
			amount: alreadyChoosedComplement ? alreadyChoosedComplement.amount : 1,
		});
		if (!productComplementWithSupply) {
			showSnackbar({ message: 'Complemento sem estoque' })
			decreaseComplementAmount({ complement });
			return;
		}
	}
	isValidToProgress()
}

function decreaseComplementAmount({ complement }) {
	// --- LÓGICA CONDICIONAL INSERIDA AQUI ---
	// Define o passo (1 ou 5) com base no ID do produto.
	let step = 5;
	if (complementStepState.product.id === 1851076) {
		step = 1;
	}
	// --- FIM DA LÓGICA CONDICIONAL ---

	const { id: complementId } = complement;
	const currentSelectedComplements = getSelectedComplementsOfCurrentPage();
	if (!currentSelectedComplements) return

	const alreadyChoosedComplement = currentSelectedComplements.complements
		.find(complement => complement.id === complementId);
	if (!alreadyChoosedComplement) return;

	alreadyChoosedComplement.amount = alreadyChoosedComplement.amount - step; // Usa a variável 'step'

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
	})

	if (complement.supply_control) {
		decreaseComplementSupplyStore({ complementId: complementId, amount: step }); // Usa a variável 'step'
	}

	isValidToProgress()
}