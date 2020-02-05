/* eslint no-restricted-globals: 0 */
import paintHeatmap from './paintHeatmap'
import filterResults from './filterResults'
import loadResults from './loadResults'
import loadError from './loadError'
import 'core-js/features/object/assign'
import 'core-js/features/object/values'
import 'core-js/features/array/flat-map'

function init({transferRoutes, sort, sortDir}) {
  self.results = []
  self.carTypes = []
  self.durations = []
  self.transferRoutes = transferRoutes
  self.sort = sort
  self.sortDir = sortDir
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

self.addEventListener('message', e => {
  // console.log('received Message', e)
  if (!e) return;
  if (e.data.type === 'googlebot_test') {
    self.postMessage({type: 'googlebot_test', message: e.data.message})
    return
  }
  if (e.data.type === 'new_search') {
    init(e.data)
    return;
  }
  if (e.data.type === 'load_results') {
    loadResults(e.data)
    return;
  }
  if (e.data.type === 'load_error') {
    loadError(e.data)
    return;
  }
  if (e.data.type === 'filter_results') {
    const _tableData = filterResults(e.data.filters)
    paintHeatmap(_tableData)
    self.postMessage({type: 'data_filtered', tableData: _tableData});
  }
})

init({})
