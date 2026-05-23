document.addEventListener('DOMContentLoaded', () => {
    const defaultItems = [
        { id: 1, name: 'Tomatoes', quantity: 2, bought: false },
        { id: 2, name: 'Cookies', quantity: 2, bought: false },
        { id: 3, name: 'Cheese', quantity: 1, bought: false }
    ];

    let items = [];

    // saving items to local storage, so we can keep state even after page refresh (bonus task)
    const stored = localStorage.getItem('shoppingListItems');
    if (stored) {
        items = JSON.parse(stored);
    } else {
        items = defaultItems;
    }

    const saveState = () => {
        localStorage.setItem('shoppingListItems', JSON.stringify(items));
        render();
    };

    const addItemForm = document.querySelector('.add-item');
    const searchInput = document.getElementById('search');
    const productList = document.querySelector('.product-list-items');
    const cartItemsList = document.querySelector('.cart-items');
    const boughtItemsList = document.querySelector('.bought-items');

    addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = searchInput.value.trim();
        if (val) {
            items.push({
                id: Date.now(),
                name: val,
                quantity: 1,
                bought: false
            });
            searchInput.value = '';
            searchInput.focus();
            saveState();
        }
    });

    const render = () => {
        productList.innerHTML = '';
        cartItemsList.innerHTML = '';
        boughtItemsList.innerHTML = '';

        items.forEach((item, index) => {
            // main list
            const li = document.createElement('li');
            const nameSpan = document.createElement('span');

            nameSpan.className = 'product-name';
            nameSpan.textContent = item.name;
            if (item.bought) {
                const s = document.createElement('s');
                s.textContent = item.name;
                nameSpan.innerHTML = '';
                nameSpan.appendChild(s);
            } else {
                nameSpan.style.cursor = 'pointer';
                nameSpan.addEventListener('click', () => {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = item.name;
                    input.className = 'product-name-input';
                    input.style.flex = '1';
                    input.style.padding = '4px 8px';
                    input.style.fontSize = '18px';
                    
                    const saveName = () => {
                        const newName = input.value.trim();
                        if (newName) {
                            item.name = newName;
                            saveState();
                        } else {
                            render();
                        }
                    };
                    
                    input.addEventListener('blur', saveName);
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            input.blur();
                        }
                    });

                    li.replaceChild(input, nameSpan);
                    input.focus();
                });
            }

            li.appendChild(nameSpan);

            // quantity controls
            if (!item.bought) {
                const btnSub = document.createElement('button');
                btnSub.className = 'btn-sub';
                btnSub.textContent = '−';
                btnSub.setAttribute('data-tooltip', 'Decrease quantity');
                btnSub.disabled = item.quantity <= 1;
                if(btnSub.disabled) {
                    btnSub.style.opacity = '0.5';
                    btnSub.style.cursor = 'not-allowed';
                }
                btnSub.addEventListener('click', () => {
                    if (item.quantity > 1) {
                        item.quantity--;
                        saveState();
                    }
                });

                const qtySpan = document.createElement('span');
                qtySpan.className = 'product-quantity';
                qtySpan.textContent = item.quantity;

                const btnAdd = document.createElement('button');
                btnAdd.className = 'btn-add';
                btnAdd.textContent = '+';
                btnAdd.setAttribute('data-tooltip', 'Increase quantity');
                btnAdd.addEventListener('click', () => {
                    item.quantity++;
                    saveState();
                });

                li.appendChild(btnSub);
                li.appendChild(qtySpan);
                li.appendChild(btnAdd);
            } else {
                const qtySpan = document.createElement('span');
                qtySpan.className = 'product-quantity';
                qtySpan.textContent = item.quantity;
                li.appendChild(qtySpan);
            }

            // bought button
            const btnBought = document.createElement('button');
            btnBought.className = 'btn-bought';
            if (item.bought) {
                btnBought.textContent = 'Unbuy';
                btnBought.setAttribute('data-tooltip', 'Mark as not bought');
            } else {
                btnBought.textContent = 'Bought';
                btnBought.setAttribute('data-tooltip', 'Mark as bought');
            }
            btnBought.addEventListener('click', () => {
                item.bought = !item.bought;
                saveState();
            });
            li.appendChild(btnBought);

            // remove button
            if (!item.bought) {
                const btnRemove = document.createElement('button');
                btnRemove.className = 'btn-remove';
                btnRemove.textContent = '×';
                btnRemove.setAttribute('data-tooltip', 'Remove item');
                btnRemove.addEventListener('click', () => {
                    items = items.filter(i => i.id !== item.id);
                    saveState();
                });
                li.appendChild(btnRemove);
            }

            productList.appendChild(li);

            // right panel stats
            const statLi = document.createElement('li');
            statLi.className = 'product-item';
            if (item.bought) statLi.classList.add('bought');
            
            const statName = document.createElement('span');
            if (item.bought) {
                const s = document.createElement('s');
                s.textContent = item.name;
                statName.appendChild(s);
            } else {
                statName.textContent = item.name;
            }

            const statAmount = document.createElement('span');
            statAmount.className = 'amount';
            statAmount.textContent = item.quantity;

            statLi.appendChild(statName);
            // space between name and amount
            statLi.appendChild(document.createTextNode(' '));
            statLi.appendChild(statAmount);

            if (item.bought) {
                boughtItemsList.appendChild(statLi);
            } else {
                cartItemsList.appendChild(statLi);
            }
        });
    };

    render();
});
