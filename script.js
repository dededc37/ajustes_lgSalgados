function increaseComplementAmount({ complement }) {
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
			amount: 5,
			title: complementTitle,
		})
		if (advancedBehavior) {
			const complementInfo = document.getElementById('complement-' + complementId);
			complementInfo.previousElementSibling.classList.remove('d-none');
			complementInfo.classList.remove('d-none');
		}
	} else {
		alreadyChoosedComplement.amount = alreadyChoosedComplement.amount + 5;
	}

	changeComplementInputAmountValue({
		inputId: 'complement-' + complementId,
		value: alreadyChoosedComplement ? alreadyChoosedComplement.amount : 5,
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
	const { id: complementId } = complement;
	const currentSelectedComplements = getSelectedComplementsOfCurrentPage();
	if (!currentSelectedComplements) return;

	const alreadyChoosedComplement = currentSelectedComplements.complements
		.find(complement => complement.id === complementId);
	if (!alreadyChoosedComplement) return;

	alreadyChoosedComplement.amount = alreadyChoosedComplement.amount - 5;

	// Se a quantidade for zerada ou negativa
	if (alreadyChoosedComplement.amount <= 0) {
		// Remove o complemento da lista de selecionados
		currentSelectedComplements.complements = currentSelectedComplements.complements
			.filter(complement => complement.id !== complementId);
		
		// Esconde os controlos (botão de subtrair e campo do número)
		if (advancedBehavior) {
			const complementInfo = document.getElementById('complement-' + complementId);
			complementInfo.previousElementSibling.classList.add('d-none'); // Esconde o botão "-"
			complementInfo.classList.add('d-none'); // Esconde o campo do número
		}
	}

	// Garante que o valor final nunca seja menor que zero
	const finalAmount = Math.max(0, alreadyChoosedComplement.amount);

	// Atualiza o valor no campo de input
	changeComplementInputAmountValue({
		inputId: 'complement-' + complementId,
		value: finalAmount,
	});

	if (complement.supply_control) {
		decreaseComplementSupplyStore({ complementId: complementId, amount: 5 });
	}

	isValidToProgress();
}