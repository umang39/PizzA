import axios from 'axios';
import Noty from 'noty'
import moment from 'moment'
let socket = io()

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter')
addToCart.forEach((btn)=>{
        btn.addEventListener('click',(e)=>{
         console.log(btn)
              axios.post('/updatecart',{pizza : btn.id})
              .then((res)=>{
                cartCounter.innerText = res.data.totalQty
                new Noty({
                    type : 'success',
                    timeout : 1000,
                    text : 'pizza added successfully 😀',
                    progressBar : false,
                    layout  : 'bottomRight'
                  }).show()
                  })
                  .catch((err)=>{
                    new Noty({
                        type : 'error',
                        timeout : 1000,
                        text : 'some error is occuring ',
                        progressBar : false,
                        layout  : 'bottomRight'
                      }).show()
                    })

              })
        })


const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
  setTimeout(() =>{
    alertMsg.remove()
  },2000)
}
///////////////////
function initAdmin(){

  const ordertableBody = document.querySelector('#orderTableBody')
  let orders = []
  let markup 

  axios.get('/admin/orders',{
    headers: {
      "X-Requested-With": "XMLHttpRequest"
  }
  }).then(res=>{
    console.log(res)
      orders = res.data
      markup = generateMarkup(orders)
      ordertableBody.innerHTML = markup
  }).catch(err=>{
      console.log(err)
  })


  function renderItems(items) {
      let parsedItems = Object.values(items)
      return parsedItems.map((menuItem) => {
          return `
              <p>${ menuItem.item.name } - ${ menuItem.qty } pcs </p>
          `
      }).join('')
    }

  function generateMarkup(orders) {
      return orders.map(order => {
          return `
              <tr>
              <td class="border px-4 py-2 text-green-900">
                  <p>${ order._id }</p>
                  <div>${ renderItems(order.items) }</div>
              </td>
              <td class="border px-4 py-2">${ order.customerId.name }</td>
              <td class="border px-4 py-2">${ order.address }</td>
              <td class="border px-4 py-2">
                  <div class="inline-block relative w-64">
                      <form action="/admin/order/status" method="POST">
                          <input type="hidden" name="orderId" value="${ order._id }">
                          <select name="status" onchange="this.form.submit()"
                              class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                              <option value="order_placed"
                                  ${ order.status === 'order_placed' ? 'selected' : '' }>
                                  Placed</option>
                              <option value="confirmed" ${ order.status === 'confirmed' ? 'selected' : '' }>
                                  Confirmed</option>
                              <option value="prepared" ${ order.status === 'prepared' ? 'selected' : '' }>
                                  Prepared</option>
                              <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>
                                  Delivered
                              </option>
                              <option value="completed" ${ order.status === 'completed' ? 'selected' : '' }>
                                  Completed
                              </option>
                          </select>
                      </form>
                      <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20">
                              <path
                                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                      </div>
                  </div>
              </td>
              <td class="border px-4 py-2">
                  ${ moment(order.createdAt).format('hh:mm A') }
              </td>
              <td class="border px-4 py-2">
                  ${ order.paymentStatus ? 'paid' : 'Not paid' }
              </td>
          </tr>
      `
      }).join('')
  }
  socket.on('orderPlaced',()=>{
    new Noty({ 
        type :'success',
        timeout : 1000,
        text : 'New Order',
        progressBar : false
    }).show()
    orders.unshift(order)
    ordertableBody.innerHTML = ''
    ordertableBody.innerHTML = generateMarkup(orders)
  })
}
initAdmin()
//change orders status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput').innerText ;
console.log(hiddenInput)
let order
axios.post('/getData',{id: hiddenInput}).then(res=>{
    console.log(res)
     order = res ? res.data : null
     
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })

}

updateStatus(order);
//join socket
if(order){
    
    socket.emit('join',`order_${order._id}`)
}


let adminAreaPath = window.location.pathname
console.log(adminAreaPath) 
if(adminAreaPath.includes('admin')){
    socket.emit('join','adminRoom')
}

socket.on('orderUpdated',(data) => {
    const updatedOrder = {...order}
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder);
    new Noty({ 
        type :'success',
        timeout : 1000,
        text : 'Order updated',
        progressBar : false
    }).show()
    console.log('virtual data '+data)
})
})

    
///socket


//order_3456789009809808