function submitJoin(e) {
    const gidInput = document.querySelector("#game-input");
    const nicknameInput = document.querySelector("#nickname-input");

    if (!nicknameInput.value || !gidInput.value) return;

    window.location.replace(`/api/game/join?nickname=${nicknameInput.value}&gid=${gidInput.value}`);
}

function submitCreate(e) {
    const nicknameInput = document.querySelector("#nickname_create");

    if (!nicknameInput.value) return;

    // get radiobutton value
    const colorInput = document.querySelector('input[name="color"]:checked');
    const color = colorInput ? colorInput.value : "r";

    window.location.replace(`/api/game/create?nickname=${nicknameInput.value}+&color=${color}`);
}
