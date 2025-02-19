<template>
    <div class="bg">
        <div class="header">
            <h1 @click="toggleTopBtn()">
                {{ leftRight === 'todo/tobuy' ? 'Monthly Expenditure' : 'To Do / To Buy' }}
            </h1>
            <transition name="page">
                <div class="hidden" 
                    v-show="isShowTopBtn">
                    <div class="btn" 
                        v-show="leftRight === 'expenditure'">clear {{ todoBuy }}</div>
                    <div class="btn" @click="toggleLeftRight()">
                        switch to {{ leftRight }}
                    </div>
                </div>    
            </transition>
        </div>
        <div class="content">
            <div class="expenditure" 
                v-show="leftRight === 'todo/tobuy'">
                <div class="expenses">
                    <div class="upper">                        
                        <div class="subject" 
                            v-for="(items, sub) in currentTotal" 
                                :key="sub">
                            <p>{{ sub }}</p>
                            <div class="expense-wrapper">
                                <div class="expense" 
                                    v-for="item in items" 
                                    :key="item">{{ item }}</div>
                            </div>
                            <div class="keyin">
                                <input type="number"
                                    placeholder="spending..."
                                    v-model="txtExpense[sub]">
                                <button class="btn" 
                                    @click="addSpending(sub)">spend</button>
                            </div>
                        </div>
                        <div class="keyin">
                            <input type="text"
                                placeholder="subject..."
                                v-model="txtSubject"
                                @keyup.enter="addExpSub()">
                            <button class="btn"
                                @click="addExpSub()">subject</button>
                        </div>
                    </div>
                    <div class="lower">
                        <div class="expense-wrapper">
                            <div class="expense"
                                v-for="(once, name) in onceGroup" 
                                :key="name">
                                <p>{{ name }}</p>
                                <p>{{ once }}</p>
                            </div>
                        </div>
                        <div class="once">
                            <div class="keyin">
                                <input type="text"
                                    placeholder="name..."
                                    v-model="onceName">                                
                            </div>
                            <div class="keyin">
                                <input type="text"
                                    placeholder="amount..."
                                    v-model="onceNum">
                                <div class="btn" 
                                    @click="addOnce">once</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="total">
                    <p @click="toggleTotel">Total</p>
                    <p>{{ monthTotal }}</p>
                    <div class="keyin" 
                        v-show="isTotal">
                        <input type="number"
                            placeholder="total..."
                            v-model="txtTotal"
                            inputmode="numeric">
                        <button class="btn" @click="setTotal()">total</button>
                    </div>
                </div>
            </div>
            <div class="todo" 
                v-show="leftRight === 'expenditure'">
                <transition name="tobuy">
                    <div class="buy" 
                        v-show="todoBuy === 'to buy'">
                        <div class="tobuys">
                            <div class="tobuy" 
                                v-for="(tobuy, cat) in toBuy" 
                                :key="cat">
                                <p @click="deleteSubject(cat)">
                                    {{ cat }}
                                </p>
                                <div class="item" 
                                    :class="{ 'done': tobuyItem[item] }"                                
                                    v-for="item in tobuy" 
                                    :key="item"
                                    @click="toggleItem(item)">
                                    {{ item }}
                                </div>
                                <div class="keyin">
                                    <input type="text" 
                                        placeholder="add item..."
                                        v-model="tobuyItem[cat]">
                                    <div class="btn"
                                        @click="addItem(cat, tobuyItem[cat])">add item</div>
                                </div>
                            </div>
                        </div>
                        <div class="keyin">
                            <input type="text" 
                                placeholder="add subject..."
                                v-model="subjectSelector">
                            <div class="btn" 
                                @click="addSubject(subjectSelector)">add</div>
                        </div>      
                    </div>  
                </transition>
                <div class="switch"
                    @click="toggleDoBuy">{{ todoBuy === 'to do' ? '>' : '<'}}</div>
                <transition name="todo">
                    <div class="do"
                        v-show="todoBuy === 'to do'">
                        <div class="todos">
                            <div class="todo" 
                                v-for="(todo, cat) in toDo" 
                                :key="cat">
                                <p @click="deleteSubject(cat)">
                                    {{ cat }}
                                </p>
                                <div class="item" 
                                    :class="{ 'done': todoItem[item] }"    
                                    v-for="item in todo" 
                                    :key="item"
                                    @click="toggleItem(item)">
                                    {{ item }}
                                </div>
                                <div class="keyin">
                                    <input type="text" 
                                        placeholder="add item..."
                                        v-model="todoItem[cat]">
                                    <div class="btn"
                                        @click="addItem(cat, todoItem[cat])">add item</div>
                                </div>
                            </div>
                        </div>
                        <div class="keyin">
                            <input type="text" 
                                placeholder="add subject..."
                                v-model="subjectSelector">
                            <div class="btn" 
                                @click="addSubject(subjectSelector)">add</div>
                        </div>         
                    </div>   
                </transition>                
            </div>        
        </div>
    </div>
</template>

<script setup>
    const leftRight = ref('todo/tobuy')
    const todoBuy = ref('to do')
    const todoSubject = ref('')
    const tobuySubject = ref('')
    const subjectSelector = computed({
        get: () => todoBuy.value === 'to do' ? todoSubject.value : tobuySubject.value, 
        set: (newVal) => {
            if(todoBuy.value === 'to do') {
                todoSubject.value = newVal
            } else {
                tobuySubject.value = newVal
            }
        }
    })
    const todoItem = ref({})
    const tobuyItem = ref({})
    const toDo = ref(null)
    const toBuy = ref(null)
    const isShowTopBtn = ref(false)    
    const toggleLeftRight = () => {
        leftRight.value === 'expenditure' 
            ? leftRight.value = 'todo/tobuy' : leftRight.value = 'expenditure'        
    }   
    const toggleDoBuy = () => {
        todoBuy.value === 'to do' 
            ? todoBuy.value = 'to buy' : todoBuy.value = 'to do'        
    }    
    const addSubject = (subject) => {
        if(isClient) {
            if(todoBuy.value === 'to do') { 
                if(!toDo.value) {
                    localStorage.setItem('todo', '')
                }   
                console.log(toDo.value)
                const newTodo = { 
                    ...toDo.value,
                    [subject]: []
                }
                console.log(newTodo)
                localStorage.setItem('todo', JSON.stringify(newTodo))
                toDo.value = JSON.parse(localStorage.getItem('todo'))
                todoSubject.value = ''
            } else if (todoBuy.value === 'to buy') {
                if(!toBuy.value) {
                    localStorage.setItem('tobuy', '')
                }   
                console.log(toBuy.value)
                const newTobuy = { 
                    ...toBuy.value,
                    [subject]: []
                }
                console.log(newTobuy)
                localStorage.setItem('tobuy', JSON.stringify(newTobuy))
                toBuy.value = JSON.parse(localStorage.getItem('tobuy'))
                tobuySubject.value = ''        
            }
        }
    }
    const addItem = (subject, item) => {
        if(isClient) {
            if(todoBuy.value === 'to do') {
                toDo.value[subject].push(item)
                console.log(toDo.value, toDo.value[subject], subject, item)            
                localStorage.setItem('todo', JSON.stringify(toDo.value ))
                todoItem.value[subject] = ''
            } else if(todoBuy.value === 'to buy') {
                toBuy.value[subject].push(item)                     
                localStorage.setItem('tobuy', JSON.stringify(toBuy.value))
                tobuyItem.value[subject] = ''
            }
        }
    }
    const toggleItem = (item) => {
        if(isClient) {
            if(todoBuy.value === 'to do') {
                if(todoItem.value[item] === undefined) todoItem.value[item] = false
                todoItem.value[item] = !todoItem.value[item]
            } else if (todoBuy.value === 'to buy') {            
                if(tobuyItem.value[item] === undefined) tobuyItem.value[item] = false
                tobuyItem.value[item] = !tobuyItem.value[item]
            }
        }
    }
    const deleteSubject = (subject) => {
        if(isClient) {
            if(todoBuy.value === 'to do') {                         
                const newTodo = Object.fromEntries(
                    Object.entries(toDo.value).filter(([key, value]) => key !== subject )
                )
                localStorage.setItem('todo', JSON.stringify(newTodo))
                toDo.value = JSON.parse(localStorage.getItem('todo'))            
            } else if(todoBuy.value === 'to buy') {                         
                const newTobuy = Object.fromEntries(
                    Object.entries(toBuy.value).filter(([key, value]) => key !== subject )
                )
                localStorage.setItem('tobuy', JSON.stringify(newTobuy))
                toBuy.value = JSON.parse(localStorage.getItem('tobuy'))            
            }
        }
    }
    const toggleTopBtn = () => {
        isShowTopBtn = !isShowTopBtn
    }
    const toggleTotel = () => {
        isTotal = !isTotal
    }
    //expenditure
    const isTotal = ref(false)
    const txtTotal = ref(null)
    const txtSubject = ref('')
    const txtExpense = ref({})
    const monthTotal = ref(null)
    const currentTotal = ref(null)
    const setTotal = () => {
        if(isClient) {
            localStorage.setItem('total', txtTotal.value)
            localStorage.removeItem('expenses')
            localStorage.removeItem('once')
        }
    }
    const spend = (num) => {
        if(isClient) {
            monthTotal.value -= num
            console.log(monthTotal.value)
            localStorage.setItem('total', monthTotal.value)
            console.log(localStorage.getItem('total'))
        }
    }
    const addExpSub = () => {
        if(isClient) {
            if(!currentTotal.value) {
                localStorage.setItem('expenses', '')
                currentTotal.value = {}
                console.log(currentTotal.value)
            }
            if(!currentTotal.value.hasOwnProperty(txtSubject.value)) {            
                const newExp = { 
                    ...currentTotal.value,
                    [txtSubject.value]: []
                }
                console.log(newExp)
                currentTotal.value = newExp
                txtSubject.value = ''
                localStorage.setItem('expenses', JSON.stringify(newExp))            
            } else {
                alert('Subject existed')
            }
        }
    }
    const addSpending = (subject) => {
        if(isClient) {
            currentTotal.value[subject].push(txtExpense.value[subject])
            localStorage.setItem('expenses', JSON.stringify(currentTotal.value))
            spend(txtExpense.value[subject])
            txtExpense.value[subject] = null        
        }
    }
    //once    
    const onceName = ref(null)
    const onceNum = ref(null)
    const onceGroup = ref(null)
    const addOnce = () => {
        if(isClient) {
            if(!onceGroup.value) {
                localStorage.setItem('once', '')
                onceGroup.value = {}
            }
            if(!onceGroup.value.hasOwnProperty(onceName.value)) {
                onceGroup.value = {
                    ...onceGroup.value, 
                    [onceName.value]: onceNum.value
                }
                spend(onceNum.value)
                onceName.value = null
                onceNum.value = null
                localStorage.setItem('once', JSON.stringify(onceGroup.value))
            }
        }
    }
    onMounted(() => {
        const storedTodo = localStorage.getItem('todo')
        const storedTobuy = localStorage.getItem('tobuy')
        const storedExpense = localStorage.getItem('expenses')
        const storedMonth = localStorage.getItem('total')
        const storedOnce = localStorage.getItem('once')
        toDo.value = storedTodo ? JSON.parse(storedTodo) : null
        toBuy.value = storedTobuy ? JSON.parse(storedTobuy) : null  
        currentTotal.value = storedExpense ? JSON.parse(storedExpense) : null
        monthTotal.value = storedMonth ? JSON.parse(storedMonth) : null
        onceGroup.value = storedOnce ? JSON.parse(storedOnce) : null

    })
</script>

<style lang="scss" scoped>
    .btn {
        border: 1px solid var(--dark-beige);
        border-radius: 10px;
        background-color: var(--dark-beige);
        color: var(--light-beige);
        width: fit-content;
        height: fit-content;
        padding: 3px 5px;    
    }
    .keyin {
        width: 100%;
        display: flex;
        gap: 5px;
        > input {
            width: 70%;
            border: none;
            background: var(--light-beige);
            color: var(--dark-blue);
            border-radius: 10px;
        }
        .btn {

        }
    }
    .bg {
        background: var(--light-blue);
        width: 100vw;
        height: 100vh;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 10px;
        .header {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            min-height: 80px;
            > h1 { 
                color: var(--light-beige);
                text-align: center; 
                margin-top: 10px;           
                font-size: 36px;
            }          
            .hidden { 
                display: flex;
                gap: 10px;
                .btn { 
    
                }
            }
        }
        .content {
            width: 100%;
            height: 90%;
            .expenditure { 
                width: 80%;
                height: 100%;
                padding: 0 10%;
                .expenses {
                    width: 90%;
                    height: 90%;
                    .upper {
                        width: 100%;
                        height: 50%;
                        border-bottom: 10px dotted var(--light-beige);
                        padding: 0 0 20px 0;
                        overflow-y: scroll;
                        overflow-x: hidden;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        .subject {                            
                            > p {
                                font-size: 32px;
                                font-weight: 550;
                                color: var(--light-beige);
                            }
                            .expense-wrapper {
                                display: flex;
                                gap: 10px;
                                flex-wrap: wrap;
                                .expense {
                                    font-size: 24px;
                                    font-weight: 400;
                                    color: var(--dark-beige);
                                }
                            }
                            > .keyin {
                                margin-top: 10px;
                            }
                        }
                        > .keyin {
                            margin-top: 10px;
                        }
                    }
                    .lower {
                        width: 90%;
                        height: 40%;
                        padding: 20px 0 0;
                        .expense-wrapper {
                            display: flex;
                            flex-direction: column;
                            gap: 5px;
                            overflow-y: scroll;
                            overflow-x: hidden;
                            height: 90%;
                            .expense {
                                display: flex;
                                gap: 10px;
                                > p {
                                    font-size: 24px;
                                    font-weight: 400;
                                    color: var(--dark-beige);
                                }
                            }
                        }
                        .once {
                            display: flex;
                            gap: 10px;
                            margin-top: 10px;
                        }
                    }
                }
                .total {
                    width: 100%;
                    height: 10%;
                    display: flex;
                    justify-content: center;
                    gap: 50px;
                    position: relative;
                    transform: translateX(-15%);
                    > p {
                        font-size: 48px;
                        font-weight: 700;
                        color: var(--dark-beige);
                    }
                    .keyin {
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 50%;
                    }
                }
            }
          
            > .todo {
                width: 100vw;
                height: 85vh;
                position: relative;
                .buy, .do {
                    width: 90%;
                    height: 90%;
                    position: relative;
                    .tobuys, .todos { 
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        overflow-y: scroll;
                        overflow-x: hidden;
                        &::-webkit-scrollbar {
                            width: 10px;
                        }
                        &::-webkit-scrollbar-track {
                            background: var(--dark-blue);
                            border-radius: 10px;
                        }
                        &::-webkit-scrollbar-thumb {
                            background: var(--light-beige);
                            border-radius: 10px;
                        }
                        .tobuy, .todo { 
                            display: flex;
                            flex-direction: column;
                            gap: 10px;
                            padding: 0 0 0 10px;
                            > p {
                                font-size: 24px;
                                font-weight: 700;
                                color: var(--light-beige);
                            }
                            .item {
                                font-size: 20px;
                                font-weight: 550;
                                color: var(--dark-beige);
                                position: relative;
                                left: 10px;
                            }
                            .done {
                                text-decoration: line-through;
                                text-decoration-color: var(--light-beige);
                            }
                        }
                    }
                    > .keyin {
                        padding: 20px 10px;
                        width: 120%;
                        position: relative;
                        top: 0;
                        left: 50%;
                        transform: translateX(-35%);
                    }
                }        
                .switch { 
                    position: absolute;
                    top: 0;
                    right: -1px;
                    background: var(--light-beige);
                    color: var(--dark-beige);
                    height: 10%;
                    font-size: 36px;
                    font-weight: 700;
                    padding: 5px;
                    border-radius: 5px;
                    display: flex;
                    align-items: center;
                }          
            
                
            }
        }    
    }
    .page-enter-active {
        transition: opacity .2s ease;
    }
    .page-leave-active {
        transition: opacity 0.5s ease;
    }
    .page-enter-from, .page-leave-to {
        opacity: 0;
    }    

    .tobuy-enter-active, .tobuy-leave-active {
        transition: opacity 1s ease, transform 1s ease;
    }
    .tobuy-enter-from, .tobuy-leave-to {
        opacity: 0;
        transform: translateY(calc(85vh * 0.9))
    }   
    .todo-enter-active, .todo-leave-active {
        transition: opacity 1s ease, transform 1s ease;
    }
    .todo-enter-from, .todo-leave-to {
        opacity: 0;
        transform: translateY(calc(85vh * 0.9))
    }    

</style>