const url = "http://localhost:3000/api/data-table/"
const container = document.querySelector('tbody')
let res = ''

const modalPerson = new bootstrap.Modal(document.getElementById('Modalpersona'))
const formPersona = document.querySelector('form')
const name = document.getElementById('name')
const last_name = document.getElementById('last_name')
const document_id = document.getElementById('document_id')

let option = ''

btncrear.addEventListener('click', ()=>{
    name.value= ''
    last_name.value= ''
    document_id.value= ''
    modalPerson.show()
    option= 'crear'
})

const getdata = (data)=>{
    
    const valuesTable = data.results.map(function(getRows) {
        return getRows;
    });
    
    valuesTable.forEach(persona => {
        res += `
        <tr>
            <td>${persona.id}</td>
            <td>${persona.values.name}</td>
            <td>${persona.values.last_name}</td>
            <td>${persona.values.document_id}</td>
            <td class="text-center"><a class="btnEdit btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a> </td>

            </tr>
        `
        container.innerHTML=res
        
    });
    
}

fetch(url)
.then(response => response.json())
.then(data => getdata(data))
.catch(error => console.log(error))

//lectura de acciones
const on = (element,event, selector, handler)=>{
    element.addEventListener(event, e =>{
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}

//Borrar
on(document, 'click', '.btnBorrar', e =>{
    const row = e.target.parentNode.parentNode
    const id =row.firstElementChild.innerHTML
    const opcion= confirm("¿Desea Borrar esta persona?");
    if (opcion == true) {
       fetch(url+id,{
           method: 'DELETE'
       })
       .then(()=> location.reload())
       
	} else {
	    console.log("Has clickado cancelar") ;
	}
})


//capturar valores de row y agregarlos a el form

let idform =0;
on(document, 'click', '.btnEdit', e =>{
    const row = e.target.parentNode.parentNode
    idform= row.children[0].innerHTML
    const nameForm =row.children[1].innerHTML
    const last_nameForm =row.children[2].innerHTML
    const document_idForm =row.children[3].innerHTML

    name.value=nameForm
    last_name.value=last_nameForm
    document_id.value=document_idForm
    option='editar'
    modalPerson.show()

    
   
})

//crear || editar
formPersona.addEventListener('submit',(e)=>{
    e.preventDefault()
    if(option=='crear'){
        fetch(url,{
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "values": {
                    "name": name.value,
                    "last_name": last_name.value,
                    "document_id": document_id.value
                    }
            })
        })
        
        .then(data=>{
            const newPerson= []
            newPerson.push(data)
            console.log(newPerson)
        })
        .then(()=> location.reload())
    }if(option=='editar'){
        fetch(url+idform,{
            method: "PUT",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "values": {
                    "name": name.value,
                    "last_name": last_name.value,
                    "document_id": document_id.value
                    }
            })
        })
        .then(()=> location.reload())
    }
    modalPerson.hide()
})

