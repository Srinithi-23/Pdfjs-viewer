import Ember from 'ember';

export default Ember.Controller.extend({

  show_Component: false,

  actions:{
    showComponent(){
      let self=this;
      self.set('show_Component',true);
    },
    hideComponent(){
      let self=this;
      self.set('show_Component',false);
    }
  }
});
