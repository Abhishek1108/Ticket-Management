
let allfilters=document.querySelectorAll(".filter")
for(let i=0;i<allfilters.length;i++){

    allfilters[i].addEventListener("click",function(e){
            let filterSelected=e.target.classList[1];
       //if slected filter is clicked again
            if(e.target.classList.contains("active-filter")){
                e.target.classList.remove("active-filter");
                ticketContent.innerHTML="";
                initTickets();
                return ;
            }
        //if active filter class is already on some element then delete class from that element
        if(document.querySelector(".active-filter")){
            document.querySelector(".active-filter").classList.remove("active-filter");

        }
            e.target.classList.add("active-filter");
            // ticketContent.style.background=filterCodes[filterSelected];
            sortTicket(filterSelected);
    })
}

//add eventListener on open modal div and function to append the html of modal on ticket content
openModal.addEventListener("click",function(e){
    

    //if modal is already open then don't open another
    if(document.querySelector(".modal")){
        return ;
    }
    //append html of modal in ticket content
    let modalDiv=document.createElement("div");
    modalDiv.classList.add("modal");
    modalDiv.innerHTML=`<div class="modal-text" contenteditable="true" spellcheck="false"  data-typed="false" > Enter your issue here!!</div>
    <div class="modal-filter-option">
        <div class="modal-filter blue"></div>
        <div class="modal-filter yellow active-filter"></div>
        <div class="modal-filter green"></div>
        <div class="modal-filter black 
        "></div>
    </div> `;
 modalDiv.querySelector(".modal-text").addEventListener("keypress",function(e){
 // console.log(e);
  //if key is enter then append the ticket and close the modal
  if(e.key=="Enter"&&e.target.getAttribute("data-typed")=="true"){
      appendTicket(e.target.textContent);
      return ;
  }
    if(e.target.getAttribute("data-typed")=="true"){
      return ;
    }
    e.target.textContent="";
    e.target.setAttribute("data-typed","true");
 
})

    ticketContent.append(modalDiv);
    let allmodalFilter=document.querySelectorAll(".modal-filter");
    for(let i=0;i<allmodalFilter.length;i++){
        allmodalFilter[i].addEventListener("click",function(e){
            console.log(e);

            activeModalFilter=e.target.classList[1];

            //if some click on already active filter
            if(e.target.classList.contains("active-filter")){
                e.target.classList.remove("active-filter");
                return ;
            }

             //if some filter is already active the it disable that filter and active another filter 
            if(document.querySelector(".active-filter")){
                document.querySelector(".active-filter").classList.remove("active-filter");
            }
             e.target.classList.add("active-filter")
            //reset active filter
            
        })
    }
})

//add eventlistener on closemodal div
closeModal.addEventListener("click",closeTheModal);
//function to close the modal
function closeTheModal(e){

    if(document.querySelector(".modal")){
       document.querySelector(".modal").remove();
}
}
//append ticket which are present in the local storage
{/* <span class="base" th:classappend="${condition ? 'condition-true' : 'condition-false'}">
   This HTML is consolidated, and the conditional class is appended separately from the static base class.
</span> */}
function  appendTicket(text){
    if(!text.length){
        return ;
    }


    let ticketDiv=document.createElement("div");
    ticketDiv.classList.add("ticket");
//     <div class="ticket">
   
// </div>
  let ticketId=uid();
    ticketDiv.innerHTML=` <div id=${ticketId} class="ticket-filter ${activeModalFilter}"></div>
    <div class="ticket-content">
        <div class="ticket-info"> 
        <div class="ticket-id">#${ticketId}</div>
        <div class="lock-unlock">
        <i id=${ticketId} class="fas fa-unlock-alt ${activeModalFilter}" status="unlocked"></i> 
        </div>
        <div class="ticket-delete "> 
        <i id=${ticketId} class="fas fa-trash-alt ${activeModalFilter}"></i>
        </div>
        </div>
        <div class="ticket-text">${text}</div>
    </div>`;
   //toggle ticket filter color
    ticketDiv.querySelector(".ticket-filter").addEventListener("click",function(e){
        let attribute=ticketDiv.querySelector(".fas").getAttribute("status");
        if(attribute=="locked"){
            return ;
        }
       let arr=["blue","yellow","green","black"];
       let currentfilter=e.target.classList[1];
       let idx=arr.indexOf(currentfilter);
       idx++;
       idx=idx%4;
          //change color of lock and trash with the change in color of ticket filter
          ticketDiv.querySelector(".ticket-delete").querySelector(".fas").classList.remove(currentfilter);
          ticketDiv.querySelector(".lock-unlock").querySelector(".fas").classList.remove(currentfilter);
          ticketDiv.querySelector(".lock-unlock").querySelector(".fas").classList.add(arr[idx]);
          ticketDiv.querySelector(".ticket-delete").querySelector(".fas").classList.add(arr[idx]);

       e.target.classList.remove(currentfilter);
       e.target.classList.add(arr[idx]);
       let ticketid=e.target.id;
       //change in local storage
       let allTickets=JSON.parse(localStorage.getItem("allTickets"));
       for(let i=0;i<allTickets.length;i++){
           if(allTickets[i].ticketId==ticketid){
               allTickets[i].ticketFilter=arr[idx];
               break;
           }
       }
       localStorage.setItem("allTickets",JSON.stringify(allTickets));
    })
    
    //delete ticket
    ticketDiv.querySelector(".ticket-delete").addEventListener("click",function(e){
        let ticketid=e.target.id;
        //remove ticket from UI
        ticketDiv.remove(); 
        //how this function have a access of ticketDiv because of closure

        let allTickets=JSON.parse(localStorage.getItem("allTickets"));

        let filteredTickets=allTickets.filter(function(ticketObj){
            return ticketObj.ticketId!=ticketid;
        })
        localStorage.setItem("allTickets",JSON.stringify(filteredTickets));
    })
    //lock-unlock ticket
    ticketDiv.querySelector(".lock-unlock").addEventListener("click",function(e){
        let colorclass=e.target.classList[2];
        console.log(e);
        if(e.target.getAttribute("status")=="unlocked"){
             e.target.className="fas fa-lock ";
             e.target.className+=colorclass;  
             e.target.setAttribute("status","locked");
             ticketDiv.querySelector(".ticket-filter").setAttribute("onclick","alert('Ticket is Locked!!')");
             //change in Ui

             //change the status of ticket in local storage
        let ticketid=e.target.id;
        let allTickets=JSON.parse(localStorage.getItem("allTickets"));
       for(let i=0;i<allTickets.length;i++){
           if(allTickets[i].ticketId==ticketid){
               allTickets[i].status="locked";
               break;
           }
       }
       localStorage.setItem("allTickets",JSON.stringify(allTickets));
             
         }else{
            e.target.className="fas fa-unlock-alt ";  
            e.target.className+=colorclass;  
            e.target.setAttribute("status","unlocked");
             ticketDiv.querySelector(".ticket-filter").removeAttribute("onclick");
             let ticketid=e.target.id;
        let allTickets=JSON.parse(localStorage.getItem("allTickets"));
       for(let i=0;i<allTickets.length;i++){
           if(allTickets[i].ticketId==ticketid){
               allTickets[i].status="unlocked";
               break;
           }
       }
       localStorage.setItem("allTickets",JSON.stringify(allTickets));
           
         }
    })
    ticketContent.append(ticketDiv);
    closeTheModal();
let ticketObj={
    ticketId:ticketId,
    ticketText:text,
    ticketFilter:activeModalFilter,
    status:"unlocked",
};
//console.log(ticketObj);
let allTickets=JSON.parse(localStorage.getItem("allTickets"));
allTickets.push(ticketObj);
localStorage.setItem("allTickets",JSON.stringify(allTickets));

    activeModalFilter="black";
}
function sortTicket(filterSelected){
 let allTickets=JSON.parse(localStorage.getItem("allTickets"));
ticketContent.innerHTML="";

 let filteredTickets=allTickets.filter(function(ticketObj){
 return ticketObj.ticketFilter==filterSelected;
 })

 for(let i=0;i<filteredTickets.length;i++){
     if(filteredTickets[i].ticketFilter==filterSelected){
        appendTicketToUi(filteredTickets[i]);
     }
 }


}