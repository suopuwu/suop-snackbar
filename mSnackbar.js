$(function () {
  var snackbars = {};
  const css = `<style>#mSnackbarContainer .mSnackbar .mSnackbar-action,#mSnackbarContainer .mSnackbar .mSnackbar-close-button{cursor:pointer;position:relative}#mSnackbarContainer .mSnackbar .mSnackbar-action::after,#mSnackbarContainer .mSnackbar .mSnackbar-close-button::after{transition:all .2s;position:absolute;content:"";width:100%;height:100%;right:0;top:0;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}#mSnackbarContainer .mSnackbar .mSnackbar-action:hover::after,#mSnackbarContainer .mSnackbar .mSnackbar-close-button:hover::after{background-color:#ffffff13}#mSnackbarContainer .mSnackbar .mSnackbar-action:active::after,#mSnackbarContainer .mSnackbar .mSnackbar-close-button:active::after{background-color:#ffffff3c}#mSnackbarContainer{display:flex;flex-flow:column nowrap;align-items:flex-end;z-index:1000;position:fixed;right:20px;overflow:hidden;pointer-events:none;bottom:0;transition:transform .5s}#mSnackbarContainer .snackbar-wrapper{overflow:hidden}#mSnackbarContainer .mSnackbar{display:flex;flex-flow:row nowrap;align-items:center;pointer-events:all;line-height:22px;padding:14px 14px 14px 24px;background-color:#323232;color:#dedede;font-size:14px;z-index:100;min-width:288px;max-width:568px;border-radius:4px;margin-bottom:20px;box-shadow:0 3px 5px -1px rgba(0,0,0,0.2),0 6px 10px 0 rgba(0,0,0,0.14),0 1px 18px 0 rgba(0,0,0,0.12);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:all .2s ease-in-out}@media(orientation:portrait){#mSnackbarContainer .mSnackbar{max-width:100%;margin:0}}#mSnackbarContainer .mSnackbar .mSnackbar-close-button{height:24px;width:24px;margin-left:12px}#mSnackbarContainer .mSnackbar .mSnackbar-close-button::after{border-radius:100%;width:40px;height:40px}#mSnackbarContainer .mSnackbar .mSnackbar-action{margin:0 7.5px 0 11.5px;font-weight:bold}#mSnackbarContainer .mSnackbar .mSnackbar-action::after{width:calc(100% + 15px);height:calc(100% + 15px);border-radius:4px}#mSnackbarContainer .mSnackbar span:first-of-type{margin:0 7.5px 0 19.5px}#mSnackbarContainer .mSnackbar .mSnackbar-flex-grow-spacer{flex-grow:1}@media(orientation:portrait){#mSnackbarContainer{right:0}}.no-transition{transition:none !important}</style>`;
  $('body').append(css)
    .append('<div id="mSnackbarContainer"></div>');
  var snackbarContainer = $('#mSnackbarContainer');
  const mSnackbarIterator = function () {
    let value = 0;
    return function () {
      return value++;
    };
  }();



  class Snackbar {
    constructor({
      text,
      lifeSpan,
      actions,
      noCloseButton: noCloseButton
    } = {}) {
      this.text = text;
      this.lifeSpan = lifeSpan;
      this.hasCloseButton = false;
      if (!actions) {
        actions = [];
      }

      if (noCloseButton) {
        this.noCloseButton = noCloseButton;
      }
      if (!lifeSpan) {
        this.lifeSpan = 3000;
      }
      //todo add optional close button
      this.id = 'mSnackbar' + mSnackbarIterator();

      function createSnackbarAction() {
        var actionsHtml = [];
        for (let action of actions) {
          console.log();
          var actionId = `snackbarAction${mSnackbarIterator()}`;
          action.id = actionId;
          actionsHtml.push(`
          <style> 
            #${actionId} {
              color: ${action.color}
            }
            #${actionId}:hover::after {
              background-color: ${action.color}13 !important;
            }
            #${actionId}:active::after {
              background-color: ${action.color}3c !important;
              
            }
            </style>
          <span class="mSnackbar-action" id="${actionId}">${action.text}</span>
          `);
          $(document).on('click', '#' + actionId, () => {
            action.onClick();
          });
        }
        return actionsHtml.join('');
      }


      snackbarContainer.append(`
      <span id="${this.id}" class="snackbar-wrapper">
        <div class="mSnackbar">
          <div>
            ${text}
          </div>
          <div class="mSnackbar-flex-grow-spacer"></div>
          ${createSnackbarAction()}
          ${ !this.noCloseButton ? `
          <span class="mSnackbar-close-button"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#DEDEDE"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg></span>
          ` : ''
          }
        </div>
      </span>
      `);
      this.$ref = $('#' + this.id);
      this.$ref.one('click', '.mSnackbar-close-button', () => {
        this.closeSnackbar();
      });
      if (this.lifeSpan !== Infinity) {
        setTimeout(() => this.closeSnackbar(), this.lifeSpan);
      }
    }

    closeSnackbar() {
      console.log(this.$ref);
      for (let action of this.$ref.find('.mSnackbar-action')) {
        $(document).off('click', '#' + action.id);
      }
      if (Object.keys(snackbars).length > 1) {
        this.$ref.animate({
          opacity: 0
        }, 200, () => {
          this.$ref.animate({
            height: 0
          }, 200, () => {
            snackbarContainer.addClass('no-transition');
            snackbarContainer.css('bottom', -snackbarContainer.height());
            snackbarContainer.css('transform', `translateY(${-snackbarContainer.height()}px)`);
            snackbarContainer[0].offsetHeight; //this does magic things that allows the transition to happen
            snackbarContainer.removeClass('no-transition');
            this.$ref.remove();
            delete snackbars[this.id];
          });
        });
      } else {
        snackbarContainer.css('bottom', -snackbarContainer.height());
        snackbarContainer.css('transform', `translateY(0px)`);
        setTimeout(() => this.$ref.remove(), 500);
        delete snackbars[this.id];
      }
    }

  }
  $.mSnackbar = function () {
    return function ({
      text,
      lifeSpan,
      actions,
      noCloseButton
    } = {}) {

      var newSnackbar = new Snackbar({
        lifeSpan: lifeSpan,
        text: text,
        actions: actions,
        noCloseButton: noCloseButton
      });
      snackbars[newSnackbar.id] = newSnackbar;
      snackbarContainer.css('bottom', -snackbarContainer.height());
      snackbarContainer.css('transform', `translateY(${-snackbarContainer.height()}px)`);
      // .css('transition', 'all 0.5s');
      return snackbars[newSnackbar.id];
    };
  }();
});
//todo make it support multiple popups
//todo add a toggleable close button