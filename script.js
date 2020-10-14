const employees = [
    {"id": 1, "dept_id": 3, "name": "Clarisse Misselbrook", "phone": "556-997-6344", "salary": 5500}, 
    {"id": 2, "dept_id": 4, "name": "Stanislas Vedenyakin", "phone": "399-807-9457", "salary": 3346}, 
    {"id": 3, "dept_id": 4, "name": "Belicia McAlroy", "phone": "585-943-3417", "salary": 4001}, 
    {"id": 4, "dept_id": 5, "name": "Jojo Etherson", "phone": "985-111-5940", "salary": 1774}, 
    {"id": 5, "dept_id": 5, "name": "Claudianus Kenworth", "phone": "745-423-3674", "salary": 2118}, 
    {"id": 6, "dept_id": 5, "name": "Tim McGaugan", "phone": "657-560-9884", "salary": 3296}, 
    {"id": 7, "dept_id": 5, "name": "Libbie Merrall", "phone": "464-356-5921", "salary": 1953}, 
    {"id": 8, "dept_id": 5, "name": "Cristal Phelps", "phone": "860-858-7445", "salary": 2500}, 
    {"id": 9, "dept_id": 5, "name": "Robby Lailey", "phone": "187-386-2418", "salary": 4299}, 
    {"id": 10, "dept_id": 6, "name": "Hazlett Mattis", "phone": "684-433-5968", "salary": 1680}, 
    {"id": 11, "dept_id": 6, "name": "Hallsy Sambell", "phone": "833-208-7189", "salary": 1001}, 
    {"id": 12, "dept_id": 7, "name": "Benson Drynan", "phone": "228-453-0434", "salary": 2225}, 
    {"id": 13, "dept_id": 7, "name": "Fin Conachy", "phone": "479-755-5337", "salary": 3474}, 
    {"id": 14, "dept_id": 8, "name": "Lelah Tapsfield", "phone": "807-689-7313", "salary": 4360}, 
    {"id": 15, "dept_id": 8, "name": "Coleman Wrigglesworth", "phone": "512-521-1999", "salary": 1586}, 
    {"id": 16, "dept_id": 8, "name": "Baily Caitlin", "phone": "726-137-1843", "salary": 4495}, 
    {"id": 17, "dept_id": 8, "name": "Charlot Guiot", "phone": "239-100-1699", "salary": 2427}, 
    {"id": 18, "dept_id": 8, "name": "Lanna Mussard", "phone": "296-454-4193", "salary": 4935}, 
    {"id": 19, "dept_id": 9, "name": "Enriqueta Erangy", "phone": "881-891-6903", "salary": 1905}, 
    {"id": 20, "dept_id": 9, "name": "Caroline Wohler", "phone": "923-266-0955", "salary": 3733}
];

let selectedEmployeeTreeItem = null;

const deptIds = [];
employees.forEach(e => {
    if (!deptIds.includes(e.dept_id)) {
        deptIds.push(e.dept_id);
    }
});

const company = [{
    id: 0,
    parent_id: null,
    name: 'ABC',
}, {
    id: 1,
    parent_id: 0,
    name: 'IT dept'
}, {
    id: 2,
    parent_id: 0,
    name: 'QA dept' 
}, {
    id: 3,
    parent_id: 1,
    name: 'IT Head'
}, {
    id: 4,
    parent_id: 3,
    name: 'Tech lead'
}, {
    id: 5,
    parent_id: 4,
    name: 'Software Engineer'
}, {
    id: 6,
    parent_id: 2,
    name: 'QA Head'
}, {
    id: 7,
    parent_id: 6,
    name: 'QA Lead'
}, {
    id: 8,
    parent_id: 7,
    name: 'QA Engineer'
}, {
    id: 9,
    parent_id: 7,
    name: 'Trainee'
},];

function makeTree(originalArr) {
    const arr = stringClone(originalArr);

    for (let i = 0; i < arr.length; i++) {
        const potentialParent = arr[i];

        for (let j = 0; j < arr.length; j++) {
            const potentialChild = arr[j];

            if (potentialChild.parent_id === potentialParent.id) {
                if (!potentialParent.children) {
                    potentialParent.children = [];
                }

                potentialParent.children.push(potentialChild);
            }
        }
    }

    return arr.filter(item => item.parent_id === null);
}

function createDOMTree(collection, containerEl) {
    const rootEl = document.createElement('ul');
    buildTree(collection, rootEl);

    containerEl.appendChild(rootEl);
}

function getBulletEl() {
    const iEl = document.createElement('i');
    iEl.classList.add('collapsed');

    return iEl;
}

function buildTree(arr, rootEl) {
    for (let i = 0; i < arr.length; i++) {
        const branchEl = arr[i];

        const liEl = document.createElement('li');

        if (branchEl.children) {
            liEl.appendChild(getBulletEl());
        }

        const spanEl = document.createElement('span');
        spanEl.innerText = branchEl.name;
        spanEl.dataset.deptId = branchEl.id;

        if (!deptIds.includes(branchEl.id)) {
            spanEl.classList.add('disabled-tree-item');
        }

        liEl.appendChild(spanEl);

        rootEl.appendChild(liEl);

        if (branchEl.children) {
            const ulEl = document.createElement('ul');
            liEl.appendChild(ulEl);
            buildTree(branchEl.children, ulEl);
        }
    }
}

const jsTree = makeTree(company);
const containerEl = document.getElementById('branchContainer');
createDOMTree(jsTree, containerEl);

containerEl.addEventListener('click', (event) => {
    if (event.target.tagName === 'SPAN') {
        const filteredEmployees =
            getEmployeesByDeptId(employees, +event.target.dataset.deptId);

        displayEmployeesData(filteredEmployees);

        selectTreeItem(event.target);
        return;
    }

    if (event.target.tagName === 'I') {
        const elToHide = event.target.parentElement.getElementsByTagName('ul')[0];
        elToHide.classList.toggle('hidden');
    }
});

function stringClone(collection) {
    return JSON.parse(JSON.stringify(collection));
}

function getEmployeesByDeptId(employeesCollection, id) {
    return employeesCollection.filter(employee => employee.dept_id === id);
}

function displayEmployeesData(employees) {
    clearTable();
    const fields = ['id', 'name', 'phone', 'salary'];
    const tBody = getTableBody();

    employees.forEach(e => {
        const tRow = document.createElement('tr');

        for (let i = 0; i < fields.length; i++) {
            const tD = document.createElement('td');
            const fieldName = fields[i];
            tD.innerText = e[fieldName];
            tRow.appendChild(tD);
        }

        tBody.appendChild(tRow);
    });
}

function getTableBody() {
    const tbodyEl = document.getElementsByTagName('tbody')[0];

    if (tbodyEl) {
        return tbodyEl;
    }

    const table = document.getElementsByTagName('table')[0];
    const newTbodyEl = document.createElement('tbody');

    table.appendChild(newTbodyEl);

    return newTbodyEl;
}

function clearTable() {
    const tBody = document.getElementsByTagName('tbody')[0];
    const table = document.getElementsByTagName('table')[0];

    if (tBody) {
        table.removeChild(tBody);
    }
}

function selectTreeItem(selectedItem) {
    clearTreeSelection();

    selectedEmployeeTreeItem = selectedItem;
    selectedItem.classList.add('selected-tree-item');
}

function clearTreeSelection() {
    if (selectedEmployeeTreeItem) {
        selectedEmployeeTreeItem.classList.remove('selected-tree-item');
    }
}

function clearAll() {
    clearTable();
    clearTreeSelection();
}

let salaries = []
function salaryList () {
    for (let i = 0; i < employees.length; i++) {
        salaries.push(employees[i].salary)
    }
}
salaryList()

async function convertion (val) {
    let v = Number(document.getElementsByTagName('tr').length);
    v = v - 2
    for (let i = 0; i <= v; i++){
        let bynSalary = document.getElementsByTagName('tbody')[0].getElementsByTagName('tr')[i].getElementsByTagName("td")[3].innerHTML;
        let CurId = 145;
        let response = await fetch(`https://www.nbrb.by/api/exrates/rates/${CurId}`);
        let result = await response.json();
        let convert = bynSalary / result.Cur_OfficialRate;
        document.getElementsByTagName('tbody')[0].getElementsByTagName('tr')[i].getElementsByTagName("td")[3].innerHTML = convert.toFixed(2)
    }

};


