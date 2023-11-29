function submitJoin(e) {
    const gidInput = document.querySelector("#game-input");
    const nicknameInput = document.querySelector("#nickname-input");

    if (!nicknameInput.value || !gidInput.value) return;

    window.location.replace(`/api/game/join?nickname=${nicknameInput.value}&gid=${gidInput.value}`);
}

function submitCreate(e) {
    const nicknameInput = document.querySelector("#nickname_create");

    if (!nicknameInput.value) return;

    window.location.replace(`/api/game/create?nickname=${nicknameInput.value}`);
}
