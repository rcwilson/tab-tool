/**
 * 
 * ### TabTool
 * 
 * ---
 * 
 * tabTool Stuff
 */

const tabTool = {

    /**
     * renameCurrentTab
     * 
     * @param {string} newTitle 
     *      Value of input field.
     */
    renameCurrentTab: async function ( newTitle ) {


        console.log("renameCurrentTab Invoked. ");

        if ( document.title && typeof newTitle === 'string' && newTitle.length > 0 ) {
            
            async function saveTitleToStorage() {
                chrome.storage.sync.set({ tabTitle: newTitle }, function() {
                    console.log("Set Tab Value: ", newTitle);
                })
            }

            async function setActiveChromeTabTitle() {
                let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: function() {
                        chrome.storage.sync.get(['tabTitle'], function(result) {
                            document.title = result.tabTitle;       
                        });
                    }
                });
    
            }

            await saveTitleToStorage();
            await setActiveChromeTabTitle();
            window.close();

        }


    }
}

const textInput     = document.querySelector('#new-title');
const submitButton  = document.querySelector('#new-title-btn');

textInput.addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitButton.click();
    }
})
submitButton.addEventListener("click", async () => {
    tabTool.renameCurrentTab( textInput.value );
});

window.onload = function() {
    textInput.focus();
}
