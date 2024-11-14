const submitBtn = document.querySelector('#submit-btn');
let urlBox = document.querySelector('#playlist-url');
submitBtn.addEventListener('click', async ()=>{
    let url = urlBox.value;

    const response = await fetch('http://127.0.0.1:3000/scraping', {
        method: 'Post',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({url:url})
    });

    if(response.ok){
        const parsedResult = await response.json();
        
        const dataString = parsedResult.data.data;
        const data = JSON.parse(dataString);

        const tpcString = parsedResult.data.topicos;
        const topicos = JSON.parse(tpcString);

        console.log(data);
        console.log(topicos);

        creatTable(data);    
        displayTopics(topicos)
     
    } else {
        const error = await response.json();
        console.error(error.message);
    }

});

function creatTable(data) {
    console.log('Entrou na função');
    
    // Seleciona o `tbody` da tabela corretamente
    let tbody = document.querySelector('#playlist-table tbody');
    tbody.innerHTML = ''; // Limpa o conteúdo anterior da tabela

    data.forEach(item => {
        const tr = document.createElement('tr');
        
        // Cria as células de dados (usando `<td>`) para cada coluna
        const tdTitle = document.createElement('td');
        tdTitle.textContent = item.title; 
        tr.appendChild(tdTitle);

        const tdDescription = document.createElement('td');
        tdDescription.textContent = item.description;
        tr.appendChild(tdDescription);

        const tdViews = document.createElement('td');
        tdViews.textContent = item.views;
        tr.appendChild(tdViews);

        const tdLikes = document.createElement('td');
        tdLikes.textContent = item.likes;
        tr.appendChild(tdLikes);

        const tdComments = document.createElement('td');
        tdComments.textContent = item.comments;
        tr.appendChild(tdComments);

        tbody.appendChild(tr);
    });

    console.log("Tabela preenchida com sucesso");
}

function displayTopics(topicos) {
    const topicsOutput = document.getElementById('topics-output');
    topicsOutput.innerHTML = ''; // Limpa o conteúdo anterior
    let topics = '';

    for(let i = 0; i < topicos.length; i++)
        topics += topicos[i] + '  ';
    
    topicsOutput.innerHTML = topics;
}