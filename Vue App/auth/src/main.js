import Vue from 'vue';
import App from './App';

new Vue ({

    //el stands for element
    el: '#app',
    render: h => {
        return h(App)
    }
})