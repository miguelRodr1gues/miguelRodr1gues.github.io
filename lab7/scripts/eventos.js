// 1. Evento de click para adicionar uma nova tarefa
document.getElementById('adicionar-tarefa').addEventListener('click', () => {
    const tarefaInput = document.getElementById('nova-tarefa');
    const tarefaTexto = tarefaInput.value;
    
    if (tarefaTexto !== "") {
        const li = document.createElement('li');
        li.textContent = tarefaTexto;
        
        // Adicionar botão para marcar como concluído
        const concluirBtn = document.createElement('button');
        concluirBtn.textContent = "Concluir";
        concluirBtn.classList.add('concluir-btn');
        li.appendChild(concluirBtn);

        // Adicionar botão para excluir tarefa
        const excluirBtn = document.createElement('button');
        excluirBtn.textContent = "Excluir";
        excluirBtn.classList.add('excluir-btn');
        li.appendChild(excluirBtn);

        // Adicionar tarefa à lista
        document.getElementById('lista-tarefas').appendChild(li);

        // Limpar campo de entrada
        tarefaInput.value = "";
    } else {
        alert("Digite uma tarefa");
    }
});

// 2. Evento de click para marcar a tarefa como concluída
document.getElementById('lista-tarefas').addEventListener('click', (e) => {
    if (e.target.classList.contains('concluir-btn')) {
        const tarefa = e.target.parentElement;
        tarefa.style.textDecoration = 'line-through';
        tarefa.style.color = 'black';
    }
});

// 3. Evento de click para excluir a tarefa
document.getElementById('lista-tarefas').addEventListener('click', (e) => {
    if (e.target.classList.contains('excluir-btn')) {
        const tarefa = e.target.parentElement;
        tarefa.remove();
    }
});

// 4. Evento de tecla pressionada (keydown) para adicionar a tarefa com a tecla Enter
document.getElementById('nova-tarefa').addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        document.getElementById('adicionar-tarefa').click();
    }
});

// 5. Evento de mudança de estilo ao passar o mouse (mouseover) sobre a tarefa
document.getElementById('lista-tarefas').addEventListener('mouseover', (e) => {
    if (e.target.tagName === 'LI') {
        e.target.style.color = '#cac300';
    }
});

// Evento de mouseout para reverter o estilo quando o mouse sair da tarefa
document.getElementById('lista-tarefas').addEventListener('mouseout', (e) => {
    if (e.target.tagName === 'LI') {
        e.target.style.color = '';
    }
});