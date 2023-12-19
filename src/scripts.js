function toggleDiv() {
    let div = document.getElementById('riskDiv');
    let div2 = document.getElementById('uncertantyDiv');
    if (div2.style.display === 'block'){
        div2.style.display = 'none';
    } 
    if (div.style.display === 'none') {
        div.style.display = 'block';
    } else {
        div.style.display = 'none';
    }
}

function toggleDiv2() {
    let div = document.getElementById('riskDiv');
    let div2 = document.getElementById('uncertantyDiv');
    if (div.style.display === 'block'){
        div.style.display = 'none';
    } 
    if (div2.style.display === 'none') {
        div2.style.display = 'block';
    } else {
        div2.style.display = 'none';
    }
}