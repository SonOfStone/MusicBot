module.exports = {
    name: 'pandora',
    description: 'Plays a song recommended by pandora',
    execute(receivedMessage, arguments, client) {
        variables = client.variables
        helpers = client.helpers

        const { Builder, By, Key, until } = require('selenium-webdriver');
        const chrome = require('selenium-webdriver/chrome');
        (async function example() {

            const screen = {
                width: 1920,
                height: 1080
            };

            var driver = new Builder().forBrowser('chrome')
                .setChromeOptions(new chrome.Options().windowSize(screen).addArguments("--mute-audio"))
                .build();

            try {
                // Navigate to Url
                await driver.get('https://www.pandora.com');

                let loginLink = await driver.wait(until.elementLocated(By.linkText("Log In")), 10000);
                await loginLink.click();

                let emailInput = await driver.wait(until.elementLocated(By.name("username")), 10000);
                let passwordInput = await driver.wait(until.elementLocated(By.name("password")), 10000);
                let submitButton = await driver.wait(until.elementLocated(By.xpath("//button[@type='submit']")), 10000);
                await emailInput.sendKeys(variables.get("pandora_user"));
                await passwordInput.sendKeys(variables.get("pandora_pass"));
                await submitButton.click();

                let shuffleButton = await driver.wait(until.elementLocated(By.xpath("//span[@class='ShuffleButton__button__shuffleString']")), 10000);
                await shuffleButton.click();
            
                songName = await driver.wait(until.elementLocated(By.xpath("//a[@class='nowPlayingTopInfo__current__trackName nowPlayingTopInfo__current__link']")), 5000);
                console.log(await songName.getText);

                songName.getText()
                .then(function (text) {
                    console.log(text);
                    //execute play command with song name as the argument
                    client.commands.get("play").execute(receivedMessage, [text + " lyrics"], client);
                    driver.close()
                });
            }catch(error){
                console.log(error);
            }
        })();
     },
};