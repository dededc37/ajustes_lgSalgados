function increaseComplementAmount({ complement }) {
	console.log("--- FUNÇÃO increaseComplementAmount EXECUTADA ---");

	const tituloElemento = document.getElementById('complement-step-title');
	// Usamos .trim() para remover espaços em branco no início ou fim do texto
	const tituloAtual = tituloElemento ? tituloElemento.innerText.trim() : '';
	console.log("Título do modal lido: ", `"${tituloAtual}"`);

	const titulosExcluidos = ["Escolha 10 salgados", "Escolha o sabor"];
	let step = 5;

	if (titulosExcluidos.includes(tituloAtual)) {
		step = 1;
	}
	console.log("Passo (step) definido para: ", step);

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
		console.log("Complemento novo. Definindo quantidade inicial como:", step);
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
		console.log("Complemento existente. Quantidade anterior:", alreadyChoosedComplement.amount);
		alreadyChoosedComplement.amount = alreadyChoosedComplement.amount + step;
		console.log("Nova quantidade:", alreadyChoosedComplement.amount);
	}

	changeComplementInputAmountValue({
		inputId: 'complement-' + complementId,
		value: alreadyChoosedComplement ? alreadyChoosedComplement.amount : step,
	});

	console.log("--- FUNÇÃO increaseComplementAmount FINALIZADA ---");
	isValidToProgress();
}

function decreaseComplementAmount({ complement }) {
	console.log("--- FUNÇÃO decreaseComplementAmount EXECUTADA ---");

	const tituloElemento = document.getElementById('complement-step-title');
	const tituloAtual = tituloElemento ? tituloElemento.innerText.trim() : '';
	console.log("Título do modal lido: ", `"${tituloAtual}"`);

	const titulosExcluidos = ["Escolha 10 salgados", "Escolha o sabor"];
	let step = 5;

	if (titulosExcluidos.includes(tituloAtual)) {
		step = 1;
	}
	console.log("Passo (step) definido para: ", step);

	const { id: complementId } = complement;
	const currentSelectedComplements = getSelectedComplementsOfCurrentPage();
	if (!currentSelectedComplements) return;

	const alreadyChoosedComplement = currentSelectedComplements.complements
		.find(complement => complement.id === complementId);
	if (!alreadyChoosedComplement) return;
	
	console.log("Diminuindo complemento. Quantidade anterior:", alreadyChoosedComplement.amount);
	alreadyChoosedComplement.amount = alreadyChoosedComplement.amount - step;
	console.log("Nova quantidade:", alreadyChoosedComplement.amount);

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
	
	console.log("--- FUNÇÃO decreaseComplementAmount FINALIZADA ---");
	isValidToProgress();
}