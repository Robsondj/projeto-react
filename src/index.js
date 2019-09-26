import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AutorBox from './Autor';
import Home from './Home';
import {Router,Route,browserHistory,IndexRoute} from 'react-router';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
	(<Router history={browserHistory}>
		<Route path="/" component={App}>
		  <IndexRoute component={Home}/>
		  <Route path="/autor" component={AutorBox}/>
		  <Route path="/livro"/>
		</Route>
    </Router>), 
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
