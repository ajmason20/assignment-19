import $ from 'jquery';

import { d620e95d99b516f732720d4ccc26e1e70fc0a31d } from '../../secrets.js'

var appContainerEl = document.querySelector('#app-container');


function buildGitProfilePage(profileApiData, reposApiData){


  var repoList = reposApiData

  var createRepoListHtml = repoList.map(function(reposApiData) {

    return `
    <div class="repos-column">
      <h3><a href=""><strong>${reposApiData.name}</strong></a></h3>
      <h4>${reposApiData.description}</h4>
      <p>${reposApiData.language} | ${reposApiData.open_issues} | ${reposApiData.created_at} </p>
      <hr>
    </div>
    `
    }).join('')

    return `
    <div class="row prof-column">
      <div class="col-xs-3">
        <img src="${profileApiData.avatar_url}">
        <h2><strong>${profileApiData.name}</strong></h2>
        <h3>${profileApiData.login}</h3>
        <button class="follow" type="button">Follow</button>
        <p>Block or report user</p>
        <hr>
        <h4>${profileApiData.company}</h4>
        <h4>${profileApiData.location}</h4>
        <h4><a href="">${profileApiData.email}</a></h4>
      </div>
      <div class="col-xs-9">
        <hr>
        ${createRepoListHtml}
      </div>
    </div>
  `
}

function controllerRouter(){
  var currentRoute = window.location.hash.slice(1)

  if( currentRoute.length === 0 ){
    currentRoute = 'home';
    var fetchProfilePromise = $.getJSON('https://api.github.com/users/ajmason20');
    var fetchRepoPromise = $.getJSON('https://api.github.com/users/ajmason20/repos');

    $.when(fetchProfilePromise, fetchRepoPromise).then( function(profileData, repoData){
      console.log('profileData', profileData[0])
      console.log('repoData', repoData[0])
      appContainerEl.innerHTML = buildGitProfilePage(profileData[0], repoData[0]);
    })
  }
  if( currentRoute !== 'home' ){
    var fetchProfilePromise = $.getJSON('https://api.github.com/users/' + currentRoute);
    var fetchRepoPromise = $.getJSON('https://api.github.com/users/' + currentRoute + '/repos');

    $.when(fetchProfilePromise, fetchRepoPromise).then( function(profileData, repoData){
      console.log('profileData', profileData[0])
      console.log('repoData', repoData[0])
      appContainerEl.innerHTML = buildGitProfilePage(profileData[0], repoData[0]);
    })

  }
}

var inputText = document.querySelector('input');

inputText.addEventListener('keypress', function(evt){
  if(evt.keyCode === 13){
    console.log(inputText.value)
    window.location.hash = inputText.value
  }
})

controllerRouter()
window.addEventListener('hashchange', controllerRouter);
inputText.addEventListener('keypress', controllerRouter);
