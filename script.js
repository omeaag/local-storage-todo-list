let goster = document.getElementById("task-list");

let gorevler = [];

if (localStorage.getItem("gorevler") !== null){
    gorevler = JSON.parse(localStorage.getItem("gorevler"));
}

let taskId;
let isEditTask = false;

const taskInput = document.querySelector("#txtTaskName");
const clearButton = document.querySelector("#btnClearTask");
const filters = document.querySelectorAll(".filters span");

displayTasks("all");
function displayTasks(filter) {
    goster.innerHTML = "";

    if(gorevler.length == 0){
        goster.innerHTML = "<p class='p-3 m-0'> Görev listeniz boş. </p>";
    }else {

        for (let gorev of gorevler){

            let completed = gorev.durum == "completed" ? "checked" : "" ;

            if(filter == gorev.durum || filter == "all") { // burada spanlardan gelen id bilgisi ile "gorev.durum" içerisindeki "id" bilgileri aynı olan ögeler yazdırılır. yani "durum" değeri "completed" olanlar "tamamlanlar"a tıklanınca yüklenecek. "pending" değerindekiler ise "yapılacaklar"a tıklanınca yüklenecek. ya da spandan gelen id bilgisi "all" ise hepsi yüklenecek çünkü herhangi bir koşul yok, sadece id "all" ise hepsini çalıştırır.

            let li =`
                    <li class="task list-group-item">
                    <div class="form-check">
                        <input onclick="statusCheck(this)" type="checkbox" id="${gorev.id}" class="form-check-input" ${completed}>
                        <label for="${gorev.id}" class="form-check-label ${completed}">${gorev.gorevAdi}</label>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis"></i>
                        </button>
                        <ul class="dropdown-menu">

                            <li><a onclick = "deleteTask(${gorev.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash"></i> Sil</a></li>
                            <li><a onclick = 'editTask(${gorev.id} , "${gorev.gorevAdi}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Düzenle</a></li>
                            
                        </ul>
                    </div>
                </li> `;
        
            goster.insertAdjacentHTML("beforeend", li);

            }
        }
    }
}

document.querySelector("#btnAddNewTask").addEventListener("click",newTask);
document.querySelector("#btnAddNewTask").addEventListener("keypress",function(){
    if(event.key == "Enter"){
        document.getElementById("btnAddNewTask").click();
    }
});

for(let span of filters){
    span.addEventListener("click",function(){
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        displayTasks(span.id);
    });
}

function newTask(event){
    
   if(taskInput.value == ""){

        alert("liste elemanı giriniz")

   }else {

        if(!isEditTask){
            //ekleme
            gorevler.push({"id": gorevler.length + 1 , "gorevAdi": taskInput.value,"durum": "pending"});

        }else {
            //güncelleme
            for(let gorev of gorevler){
                if(gorev.id == taskId){
                    gorev.gorevAdi = taskInput.value;
                }
                isEditTask = false;
            }
        }

        taskInput.value = "";

         displayTasks(document.querySelector("span.active").id);
         localStorage.setItem("gorevler",JSON.stringify(gorevler));
   }
    event.preventDefault();
}

function deleteTask(idInfo) {
    
    let deleteId;

    for(let index in gorevler){

        if(gorevler[index].id == idInfo){

            deleteId = index;
        }
    }

    gorevler.splice(deleteId,1); // burada elemanı sildik
    displayTasks(document.querySelector("span.active").id); //silinen eleman hariç diğer elemanları tekrar yükledik.
    localStorage.setItem("gorevler",JSON.stringify(gorevler));
}

function editTask(editId,editTask) {
    taskId = editId;
    isEditTask = true;
    taskInput.value = editTask;
    taskInput.focus();
    taskInput.classList.add("active");
}

clearButton.addEventListener("click",clearCheckedTasks);

function clearCheckedTasks() {
    gorevler.splice(0, gorevler.length);
    localStorage.setItem("gorevler",JSON.stringify(gorevler));   
    displayTasks();
}


function statusCheck(durumKontrol) {
    let label = durumKontrol.nextElementSibling;
    let durum;
    if(durumKontrol.checked){
        label.classList.add("checked");
        durum = "completed";

    }else {
        label.classList.remove("checked");
        durum = "pending";
    }

    for(let gorev of gorevler){
        if(gorev.id == durumKontrol.id){
            gorev.durum = durum;
        }
    }
    displayTasks(document.querySelector("span.active").id); // bu satır, işaretlenen görevlerin anında, eşleştikleri "span" bölümüne aktarılmasını sağlıyor. yani "yapılacaklar" kısmına gelindiğinde bir görevi işaretlersek anında "yapılacaklar" bölümünden kaybolup "tamamlananlar" bölümüne aktarılır.
    localStorage.setItem("gorevler",JSON.stringify(gorevler));
}




