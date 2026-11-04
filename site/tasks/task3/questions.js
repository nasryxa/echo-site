const questions = [
    {
        text: 'А когда с человеком может произойти дрожемент?',
        answers: [
            'Когда он влюбляется',
            'Когда он идет шопиться',
            'Когда он слышит смешную шутку',
            'Когда он боится, пугается'
        ],
        correct: [3],
        explain: 'Лексема «дрожемент» имплицирует состояние крайнего напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят».'
    },
    {
        text: 'Говорят, Антон заовнил всех. Это еще как понимать?',
        answers: [
            'Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?',
            'Антон очень надоедливый и въедливый человек, всех задолбал',
            'Молодец, Антон, всех победил!',
            'Нет ничего плохого в том, что Антон тщательно выбирает себе друзей'
        ],
        correct: [2],
        explain: 'Термин «заовнить» заимствован из английского языка, он происходит от слова own и переводится как «победить», «завладеть», «получить».'
    },
    {
        text: 'А фразу «заскамить мамонта» как понимать?',
        answers: [
            'Разозлить кого-то из родителей',
            'Увлекаться археологией',
            'Развести недотепу на деньги',
            'Оскорбить пожилого человека'
        ],
        correct: [2],
        explain: 'Заскамить мамонта — значит обмануть или развести на деньги. Почему мамонта? Потому что мошенники часто выбирают в жертвы пожилых людей.'
    },
    {
        text: 'Кто такие бефефе?',
        answers: [
            'Вши?',
            'Милые котики, такие милые, что бефефе',
            'Лучшие друзья',
            'Люди, которые не держат слово'
        ],
        correct: [2],
        explain: 'Бефефе — это лучшие друзья. Этакая аббревиатура от английского выражения best friends forever.'
    },
    {
        text: 'Что из перечисленного можно назвать <b>крашем</b>, если ты <b>чиллишь</b> в компании и вдруг <b>залипаешь</b> на кого-то?',
        answers: [
            'Человек, который тебе очень нравится и вызывает симпатию.',
            'Тот, на кого приятно смотреть и хочется общаться.',
            'Твоя сильно накрашенная подруга, которая переоценила свой макияж',
            'Трэш в более мягкой интерпретации'
        ],
        correct: [0, 1],
        explain: '«Краш» — это объект симпатии; «чиллить» — расслабляться, отдыхать; «залипать» — засматриваться или задумываться.'
    },
];


const btnQuestion = document.getElementById('btnQuestion');
const message = document.getElementById('message');
const area = document.getElementById('area');
const stats = document.getElementById('stats');


function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}
shuffle(questions);

let current = 0;
let score = 0;

let start = 2500;
let step = 200;
let move_time = 400;


let finished = false;


function showQuestion() {
    if (current >= questions.length) {
        finishTest();
        return;
    }

    let q = questions[current];

    //для всего вопроса блок
    let block = document.createElement('div');
    block.className = "question";

    //строка текст+маркер
    let head = document.createElement('div');
    head.className = "question__head";

    //текст вопроса
    let text = document.createElement('span');
    text.className = "question__text";
    text.innerHTML = (current + 1) + ') ' + q.text;

    //маркер
    let mark = document.createElement('span');
    mark.className = "question__mark";

    head.appendChild(text);
    head.appendChild(mark);
    block.appendChild(head);

    head.addEventListener('click', function () {
        showCorrect(q, block);
    });

    let answerBox = document.createElement('div');
    answerBox.className = 'answers';

    //массив с номерами вопросов [0,1,2,3]
    let order = [];
    for (let i = 0; i < q.answers.length; i++) {
        order.push(i);
    }
    shuffle(order); //премешивание массива [1,0,3,2]


    //вывод ответов по перемешанным номерам 1, 0, 3, 2
    // к место на экране
    for (let k = 0; k < order.length; k++) {
        //настоящий номер ответа, показ номера ответа 1
        let index = order[k]

        let answer = document.createElement('div');
        answer.className = 'answer';
        answer.innerHTML = q.answers[index];
        answer.dataset.index = index;

        //проверка ответа
        answer.addEventListener('click', function () {
            chooseAnswer(q, this, block);
        });

        answerBox.appendChild(answer); //добавился 1 ответ
    }

    block.appendChild(answerBox);
    area.appendChild(block);

    current++;
    btnQuestion.disabled = true;
}

function chooseAnswer(q, answer, block) {
    if (block.classList.contains('answered')) {
        return;
    }
    block.classList.add('answered');

    let index = Number(answer.dataset.index);
    let isRight = q.correct.includes(index);
    let mark = block.querySelector('.question__mark');

    if (isRight) {
        score++;
        answer.classList.add('answer__right');

        let explain = document.createElement('p');
        explain.className = 'answer__explain';
        explain.innerHTML = q.explain;
        answer.appendChild(explain);

        mark.innerHTML = 'V';
        mark.classList.add('question__mark__right')
    }
    else {
        answer.classList.add('answer__wrong');
        mark.innerHTML = 'X';
        mark.classList.add('question__mark__wrong');
    }

    setTimeout(function () {
        hideAnswers(block, answer, isRight);
    }, start);
}



function hideAnswers(block, chosen, isRight) {
    let answers = block.querySelectorAll('.answer');
    let queue = [];

    for (let i = 0; i < answers.length; i++) {
        if (isRight && answers[i] == chosen) {
            continue;
        }
        queue.push(answers[i]);
    }
    if (isRight) {
        queue.push(chosen);
    }

    for (let k = 0; k < queue.length; k++) {
        setTimeout(function () {
            queue[k].classList.add('answer__gone');
        }, k * step);
    }

    let total = (queue.length - 1) * step + move_time;

    setTimeout(function () {
        let box = block.querySelector('.answers');
        block.removeChild(box);
        btnQuestion.disabled = false;
    }, total)
}


function finishTest() {
    message.innerHTML = 'Вопросы закончились';
    stats.innerHTML = 'Правильных ответов: ' + score + ' из ' + questions.length;
    btnQuestion.disabled = true;
    finished = true;
    area.classList.add('finished');
}

function showCorrect(q, block) {
    if (!finished) {
        return;
    }

    let opened = area.querySelector('.correct');

    if (opened !== null) {
        let openedBlock = opened.parentNode;
        openedBlock.removeChild(opened);

        if (openedBlock === block) {
            return;
        }
    }

    let correctBox = document.createElement('div');
    correctBox.className = 'correct';

    for (let i = 0; i < q.correct.length; i++) {
        let item = document.createElement('p');
        item.className = 'correct__answer';
        item.innerHTML = q.answers[q.correct[i]];
        correctBox.appendChild(item);
    }

    let explain = document.createElement('p');
    explain.className = 'correct__explain';
    explain.innerHTML = q.explain;
    correctBox.appendChild(explain);

    block.appendChild(correctBox);
}

btnQuestion.addEventListener('click', showQuestion);