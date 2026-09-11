/* Flow v2 — shared demo fixtures. Fictional personas; real platform marks. */
(function () {
  'use strict';

  var PLATFORMS = {
    realloves: { name: 'RealLoves', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE4MCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik00MC40MzIzIDE0LjYyMDFDMzkuOTIzNSAxNC44NzUgMzguMDg2NSAxNS43NjQ4IDM2LjMxIDE2LjU4OThDMjUuOTEzOSAyMS40NzkzIDE5LjM4NTYgMzQuMzA3NiAyMS4zNDc1IDQ1Ljk5MTVDMjUuMTUwNyA2OC4wODkyIDQzLjU5NzIgOTAuMzc3MSA2NC44MzggOTguNDQ1NkM2OC43NzA1IDk5LjkwNTYgNzYuMTIyMyAxMDAuNDE1IDc3LjI2NSA5OS4yNzA2Qzc3LjU4NDEgOTguOTU1MyA3Ny4zMjk3IDk3Ljg3NTQgNzYuNTY2NSA5Ni41NDA3QzcxLjQzMDkgODcuMzk2NyA2OC40NTE0IDc5LjMzMjUgNjcuOTQyNiA3My4wNDM2QzY3LjE4MzYgNjMuNjQ0NyA2OS43ODM4IDU2LjIxNTQgNzYuMTgyOCA0OS44NjZDODEuNjk3OCA0NC4zNDE2IDg3LjIxMjcgNDEuOTI3IDkzLjkzNTEgNDEuOTI3QzEwMC42NTcgNDEuOTI3IDEwNS43MjggNDMuODMxOCAxMTIuMjU3IDQ5LjIzMUwxMTYuMjQ5IDUyLjUzMUwxMjAuMDU3IDQ5LjIzMUwxMjMuNzk1IDQ1Ljg2NjNMMTIzLjY3IDQwLjU5NjZDMTIzLjM1NiAyOS41NDc3IDExNy4zOTYgMjAuMjc0MSAxMDcuOTQ5IDE2LjIwOTZDMTA2LjU1MiAxNS41NzQ3IDEwNC45MDUgMTQuODc1IDEwNC4zMzYgMTQuNTU5N0MxMDIuNzQ5IDEzLjczNDcgOTQuMDY0NSAxMy44NTk5IDkxLjk3MzIgMTQuNjg0OUM4Ny4yODE3IDE2LjY1NDUgODUuODg4OSAxNy4zNTQzIDgzLjA5OTEgMTkuNTE0Qzc5LjgwMDUgMjEuOTg5IDc2LjM3NjggMjUuMjkzMyA3NC4yMjUxIDI4LjE0ODNMNzIuODI4IDI5Ljk5MjdMNjcuMjQ4MyAyNC4zMzg2QzYyLjA0ODEgMTkuMTMzOCA2MC43ODA0IDE4LjMwNDUgNTIuOTg0NCAxNC40OTQ5QzUxLjUyNjkgMTMuODU5OSA0MS43IDEzLjkyNDcgNDAuNDMyMyAxNC42MjAxWk00NS42OTI4IDI5LjczMzVDNTAuMzE5NiAzMy45MjMzIDQ5LjM3MSA0MC41MzE5IDQzLjczMDkgNDMuMjYxN0M0MS4wNjYxIDQ0LjU5NjQgNDAuOTQxMSA0NC41OTYzIDM4LjE1MTIgNDMuNTE2NUMzMi43MDA5IDQxLjQyMTYgMzAuOTg5IDM1LjEzMjYgMzQuNzI3NSAzMC44NzgxQzM1LjgwNTUgMjkuNjczIDM3LjMyNzYgMjguNTI4NCAzOC4wODY1IDI4LjQwMzFDNDAuNDMyMiAyNy44OTM0IDQ0LjQyNTEgMjguNTkzMiA0NS42OTI4IDI5LjczNzhWMjkuNzMzNVoiIGZpbGw9IiMzNTdDQjkiLz4KPHBhdGggZD0iTTkwLjczNDQgNDYuNjc5MUM4Ni43NTM4IDQ3LjM3NTMgODEuMjUxNCA1MC4zNDQ2IDc4LjcyODEgNTMuMjQ5NkM3My41NDgyIDU5LjI1MjkgNzEuNDU5IDY2LjcwODggNzIuNzg3MyA3NC4xMDAxQzc0LjE3NTggODEuNTU1OSA3OC4zNDk4IDkwLjU4ODkgODMuNTI5OCA5Ny42MDIxQzg4LjQ2MDQgMTA0LjIzNyA5OC42OTk5IDExMi44OTIgMTA1LjAxOSAxMTUuNzM3QzExNC41NjIgMTIwLjA5OCAxMTguNDE4IDExOS45NyAxMjcuODM3IDExNS4yOTRDMTQyLjk0MiAxMDcuNzA5IDE1Ni41OTUgODkuODMyNiAxNTkuMzEyIDczLjk3NTZDMTYxLjIwNyA2My4zNjEyIDE1Ni4wODggNTIuOTM2IDE0Ni44NTggNDguNTE0MUMxNDMuMjU2IDQ2LjgwOCAxNDIuMDU3IDQ2LjU1NDQgMTM3LjYzMyA0Ni42MTg5QzEzMC44NzEgNDYuNjE4OSAxMjYuNzAyIDQ4LjcwMzEgMTIwLjUwNyA1NS4wODQ2TDExNi4wODQgNTkuNjk1NkwxMTEuMjE4IDU0Ljc3MDlDMTA0LjM5MSA0Ny44ODIzIDk4LjE5NyA0NS40ODQ1IDkwLjczODcgNDYuNjgzNEw5MC43MzQ0IDQ2LjY3OTFaTTkxLjkzMzggNTguODEwNEM5NC4zOTY5IDYwLjA3MzggOTUuNTM2MSA2Mi4wMzMzIDk1LjUzNjEgNjUuMTI3NEM5NS41MzYxIDY5LjIzNTYgOTMuMzg2NyA3MS4zOCA4OS4yMTcgNzEuMzhDODQuNjA0NCA3MS4zOCA4MS42OTQyIDY3Ljk2NzkgODIuNTE5NiA2My41NDZDODMuMzQwNiA1OS4zNzc2IDg4LjIwNjcgNTYuOTExIDkxLjkzOCA1OC44MTA0SDkxLjkzMzhaIiBmaWxsPSIjRkY1OTY2Ii8+CjxwYXRoIGQ9Ik03Ny4xMTU5IDEwMy44ODhDNzYuMjE1MSAxMDQuMjU0IDczLjMyMDUgMTA0LjQzNyA3MC40OTU4IDEwNC4yNTRMNjUuNDE1IDEwMy45NTFMNjQuNTE0MiAxMDUuOTY3QzYyLjc3ODMgMTA5Ljk5OSA2NC44Mzc3IDExMS4xNjMgNzMuNTEyOSAxMTEuMTYzQzc4LjQ2MjYgMTExLjE2MyA3OS44MTM3IDExMC45OCA4MS4wMzM3IDExMC4wMDNDODIuNTExNiAxMDguODQzIDgyLjU3NzIgMTA4Ljc4MSA4MS42MTA4IDEwNi4xNTRDODAuNTgzMyAxMDMuMzQ0IDc5LjY4MjYgMTAyLjkxNSA3Ny4xMTE1IDEwMy44OTJMNzcuMTE1OSAxMDMuODg4WiIgZmlsbD0iIzM1N0NCOSIvPgo8cGF0aCBkPSJNNzAuOTg5NSAxMjEuNDk3QzcwLjk4OTUgMTI0LjA3IDcxLjY5MzYgMTI4Ljc2NSA3MS42OTM2IDEyOC43NjVDNzEuNjkzNiAxMjguNzY1IDcyLjQzNzMgMTM0LjE2OSA3Mi44Nzg1IDEzNi42MTRDNzMuNjk2NyAxNDEuMzIgNzMuNTQwMSAxNDEuNjQ3IDc0LjE1NzkgMTQzLjU1Qzc0Ljk5MzggMTQ2LjEyNiA3Ni4wNDc5IDE0OC45NjQgNzguMzgyNCAxNTIuMzUxQzgyLjk3ODQgMTU5LjA2MyA4NS43NDk4IDE2MS4wNzIgODcuNTc4OCAxNTkuMjVDODguNzEzOSAxNTguMTI0IDg4LjUyNTQgMTU3LjM2OSA4Ni4zODM3IDE1NC45ODRDNzkuNzkwNSAxNDguMTI3IDc3Ljg1NTggMTQ0LjM5MiA3NS41ODk5IDEyMS44NzNMNzUuMDg0NSAxMTcuMTcxTDczLjA3MTMgMTE2Ljk4M0w3MC45OTM4IDExNi43OTVWMTIxLjUwMkw3MC45ODk1IDEyMS40OTdaIiBmaWxsPSIjMzU3Q0I5Ii8+CjxwYXRoIGQ9Ik0xMjAuMjUyIDEyMy43OTNDMTE5LjA1NyAxMjQuMTUyIDExNi4yODYgMTI0LjI3NCAxMTQuMDgxIDEyNC4wMzNDMTEwLjM2NCAxMjMuNzMyIDExMC4xMTUgMTIzLjc5MyAxMDkuNDIxIDEyNS4xNzZDMTA4LjQxNSAxMjcuMzM0IDEwOS4xNjkgMTI4LjIzNSAxMTIuNjMzIDEyOS4wNzJDMTE2LjQ3NSAxMjkuOTEyIDEyMS41NzUgMTI5LjM2OSAxMjMuNDY0IDEyNy45MzNDMTI0Ljc4NyAxMjYuOTE0IDEyNC43ODcgMTI2Ljg1MiAxMjMuNzc3IDEyNC45OTZDMTIzLjIxMSAxMjMuOTE1IDEyMi42NDIgMTIzLjA3NSAxMjIuNTgyIDEyMy4xMzZDMTIyLjUxOCAxMjMuMTM2IDEyMS40NDcgMTIzLjQzNCAxMjAuMjUyIDEyMy43OTdWMTIzLjc5M1oiIGZpbGw9IiNGRjU5NjYiLz4KPHBhdGggZD0iTTExMy44OTIgMTM0Ljg1MkMxMTMuNzAxIDEzNS4xNjkgMTEzLjM4MSAxMzcuNjI1IDExMy4xMjYgMTQwLjM5OUMxMTIuNzQ1IDE0NS4xMjIgMTEyLjQyNSAxNDcuMDE3IDExMC43NzMgMTUzLjk0N0MxMDkuODk0IDE1Ny42MzIgMTA4Ljk5IDE1OC4xNiAxMDguOTkgMTU4LjE2QzEwNy42MDIgMTYwLjQ0OCAxMDUuOTQgMTYyLjMxNyAxMDYuMTkxIDE2My41MThDMTA2Ljc2MiAxNjUuNTk2IDEwOC44IDE2NS40NjggMTEwLjc3MyAxNjMuMjY1QzExMi4xNzggMTYxLjY5NSAxMTQuMzQ5IDE1OS4wNCAxMTUuNDE5IDE1NC44OUMxMTYuODE2IDE0OS40NzMgMTE4LjUzNCAxMzYuNDg5IDExOC4wOTIgMTM1LjE2NUMxMTcuNzcyIDEzNC4zNDYgMTE0LjMzNyAxMzQuMDkzIDExMy44OTYgMTM0Ljg0OEwxMTMuODkyIDEzNC44NTJaIiBmaWxsPSIjRkY1OTY2Ii8+Cjwvc3ZnPgo=' },
    findbride: { name: 'FindBride', logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMSIgZmlsbD0ibm9uZSI+CiAgPHBhdGggZmlsbD0iI0ZGNDE1OSIgZD0ibTkuOTEgMTUuMi0uNjItLjY2LTIuNTItMi42OSAyLjI5LTIuNDRMNy4zIDcuNTQgNS4wMiA5Ljk4bC0uMDgtLjA5LS43Ni0uOGMtLjM5LS40Mi0uNjQtLjktLjc1LTEuNDNhMi42NiAyLjY2IDAgMCAxIC4xNy0xLjYybC4wNi0uMTQtMS44LTEuOTMtLjIuMjd2LjAyYTUuMzggNS4zOCAwIDAgMC0uNDMgNC45MWMuMjQuNjQuNjEgMS4yMyAxLjExIDEuNzZsLjUzLjU3IDEuNjQgMS43NWMxLjU3IDEuNjcgMy41MyAzLjc1IDQuODEgNS4xMy4xOC4yLjM4LjMuNi4zLjIxIDAgLjQxLS4xLjU4LS4yOWguMDFsLjk0LTEuMDIuMjYtLjI3LTEuOC0xLjlaIi8+CiAgPHBhdGggZmlsbD0iIzk4MkQ1OCIgZD0iTTE4LjggNS42OGE0Ljg0IDQuODQgMCAwIDAtMS41Ni0yLjUzIDQuNTMgNC41MyAwIDAgMC0zLjQ0LTEuMTIgNC43OSA0Ljc5IDAgMCAwLTMuMSAxLjUxbC0uNTcuNjItLjIuMjJjLS4yOC0uMzEtLjU3LS42Mi0uODgtLjkyYTQuNiA0LjYgMCAwIDAtNC44LTEuMjJjLS41Mi4xNi0xIC40LTEuNDIuNzFsLS4zNC4yNkw0LjMgNS4xNWwuMjMtLjEzYS45LjkgMCAwIDEgLjIyLS4xYy45Ni0uNCAxLjgtLjIzIDIuNTcuNTIuNTIuNSAxLjAzIDEuMDYgMS41MSAxLjZsLjUuNTRjLjA3LjA3LjI3LjMuNi4zLjMyIDAgLjUzLS4yMi42LS4zbDEuMDYtMS4xNC44LS44NWMuNDEtLjQ1LjktLjcyIDEuNDgtLjgzYTIuMiAyLjIgMCAwIDEgMi40NCAxLjQ1Yy4zNSAxLjAxLjE5IDEuOS0uNSAyLjczbC0uNzIuNzhWOS43bC0xLjY0IDEuNzMtMS4yMyAxLjMtMi40OC0yLjY0LTEuNjcgMS43OCAyLjU4IDIuNzUgMS43IDEuODEgMS42Ny0xLjc4IDEuODUtMS45Ny40OS0uNTIuMzgtLjQuMDEtLjAxLjQtLjQyLjU0LS42YTUuNTIgNS41MiAwIDAgMCAxLjExLTUuMDZaIi8+Cjwvc3ZnPg==' },
    livebeam: { name: 'LiveBeam', logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+CiAgPHBhdGggZmlsbD0idXJsKCNhKSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMi4wNyA1LjIyYTMuNDkgMy40OSAwIDAgMSAzLjQtMy41Nmg5LjE4YzEuODggMCAzLjQgMS42IDMuNCAzLjU2djkuNTVhMy40OSAzLjQ5IDAgMCAxLTMuNCAzLjU2SDUuNDhhMy40OSAzLjQ5IDAgMCAxLTMuNDEtMy41NnYtMi43TDAgMTBsMi4wNy0yLjNWNS4yMlpNMTQuNTYgMTBhNC42IDQuNiAwIDAgMS00LjUgNC42OEE0LjYgNC42IDAgMCAxIDUuNTYgMTBhNC42IDQuNiAwIDAgMSA0LjUtNC43IDQuNiA0LjYgMCAwIDEgNC41IDQuN1oiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogIDxwYXRoIGZpbGw9IiMzMDMwMzAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTkuNzEgNy45NGMwIC45My0uNzMgMS42OS0xLjYyIDEuNjlhMS42IDEuNiAwIDAgMS0xLjI4LS42NWMtLjEuMzItLjE1LjY2LS4xNSAxLjAyYTMuNDcgMy40NyAwIDAgMCAzLjQgMy41NGMxLjg4IDAgMy40LTEuNTkgMy40LTMuNTRhMy40NyAzLjQ3IDAgMCAwLTMuNC0zLjU1Yy0uMzQgMC0uNjcuMDYtLjk4LjE1LjM4LjMxLjYzLjguNjMgMS4zNFptMS42NiA0LjM3Yy40NSAwIC44MS0uMzguODEtLjg0YS44My44MyAwIDAgMC0uOC0uODUuODMuODMgMCAwIDAtLjgyLjg1YzAgLjQ2LjM3Ljg0LjgxLjg0WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIzLjc2IiB4Mj0iMTguMDQiIHkxPSIxOC4zMyIgeTI9IjIuODIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzU3NERDQyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM1NzlBRkYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgo8L3N2Zz4=' },
    talkytimes: { name: 'TalkyTimes', logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+CiAgPHBhdGggZmlsbD0idXJsKCNhKSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNNy4zNSAxLjY2YTUuNjggNS42OCAwIDAgMC01LjY4IDUuNjh2NS4zYTUuNjggNS42OCAwIDAgMCA1LjY4IDUuNjloNS4zYTUuNjggNS42OCAwIDAgMCA1LjY4LTUuNjh2LTUuM2E1LjY4IDUuNjggMCAwIDAtNS42OC01LjY5aC01LjNabS0yLjMgNC43NSA5LjI2LTEuNTNjLjQ1LS4wNy44Mi4yMi44Mi42NnY3LjMxYzAgLjQ0LS4zNi42OS0uOC41NmwtMS4wMy0uM2E4LjQzIDguNDMgMCAwIDEtNi40IDIuNjZzMi4yNi0xLjI2IDIuNzUtMy43NGwtNC42My0xLjM2YTEuMTUgMS4xNSAwIDAgMS0uNzktMS4wMlY3LjMzYzAtLjQ0LjM3LS44NS44MS0uOTJabTIuNDQgMi4xOGMwIC4zLjI2LjU1LjU3LjU1LjMyIDAgLjU4LS4yNC41OC0uNTUgMC0uMy0uMjYtLjU0LS41OC0uNTRhLjU2LjU2IDAgMCAwLS41Ny41NFptMS43OCAwYzAgLjMuMjYuNTUuNTcuNTUuMzIgMCAuNTgtLjI0LjU4LS41NSAwLS4zLS4yNi0uNTQtLjU4LS41NGEuNTYuNTYgMCAwIDAtLjU3LjU0Wm0xLjc4IDBjMCAuMy4yNi41NS41Ny41NS4zMiAwIC41OC0uMjQuNTgtLjU1IDAtLjMtLjI2LS41NC0uNTgtLjU0YS41Ni41NiAwIDAgMC0uNTcuNTRaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjIuNjYiIHgyPSIxOC4zMyIgeTE9IjEuNjYiIHkyPSIxOC4zMyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMDAwQUZGIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAyMDA1OSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+Cjwvc3ZnPg==' },
    chatshouse: { name: 'ChatsHouse', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNyAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00LjY1OTUxIDBDMy4xMzQ2IDAgMS44OTgxIDEuMjExNzcgMS44OTgxIDIuNzA2MTlWNS42NzM5N0wyLjk3MTk4IDUuMTYxM1YyLjU1NTg0QzIuOTcxOTggMS43MjU5NCAzLjY1OTI3IDEuMDUyNDEgNC41MDYxIDEuMDUyNDFIMTIuMTc2N0MxMy4wMjM1IDEuMDUyNDEgMTMuNzEwOCAxLjcyNTk0IDEzLjcxMDggMi41NTU4NFY2LjAzMTc5TDguMjg0NjQgMy40MzgzNkwwLjMyMTAyNSA3LjI0MzU2QzAuMDM3MjEzNCA3LjM3ODg2IC0wLjA4MDkxNDggNy43MTQxMyAwLjA1ODY5IDcuOTkyMjdDMC4xOTY3NjEgOC4yNzA0IDAuNTM4ODY5IDguMzg2MTcgMC44MjI2ODEgOC4yNDkzNUwxLjg5OTYzIDcuNzM1MThWOS45MjQxOEMxLjg5OTYzIDExLjQxODYgMy4xMzYxMyAxMi42MzA0IDQuNjYxMDUgMTIuNjMwNEgxMS40ODc5TDEzLjgwNTkgMTQuMzIxN0MxNC4yMTA5IDE0LjYxNjQgMTQuNzg2MiAxNC4zMzM4IDE0Ljc4NjIgMTMuODM5MVY4LjQ4NjlMMTMuNzEyMyA3Ljk3NDIzVjEyLjg1NzRMMTIuMDI0OCAxMS41Nzk1SDQuNTA3NjNDMy42NjA4IDExLjU3OTUgMi45NzM1MiAxMC45MDU5IDIuOTczNTIgMTAuMDc2VjcuMjI0MDFMOC4yODQ2NCA0LjY4NjIxTDE1Ljc0NTEgOC4yNTIzNkMxNi4wMjg5IDguMzg3NjcgMTYuMzcxIDguMjcxOTEgMTYuNTA5IDcuOTk1MjdDMTYuNjQ3MSA3LjcxNzE0IDE2LjUyOSA3LjM4MTg3IDE2LjI0NjcgNy4yNDY1NkwxNC43ODc4IDYuNTQ4OTdWMi43MTA3QzE0Ljc4NzggMS4yMTYyOCAxMy41NTEzIDAuMDA0NTEwMzEgMTIuMDI2NCAwLjAwNDUxMDMxSDQuNjYyNThMNC42NTk1MSAwWk01LjczMzQgOS4zMjEzQzYuMTU2ODEgOS4zMjEzIDYuNTAwNDYgOC45ODQ1MyA2LjUwMDQ2IDguNTY5NTlDNi41MDA0NiA4LjE1NDY0IDYuMTU2ODEgNy44MTc4NyA1LjczMzQgNy44MTc4N0M1LjMwOTk4IDcuODE3ODcgNC45NjYzNCA4LjE1NDY0IDQuOTY2MzQgOC41Njk1OUM0Ljk2NjM0IDguOTg0NTMgNS4zMDk5OCA5LjMyMTMgNS43MzM0IDkuMzIxM1pNOS4xMDg0NiA4LjU2OTU5QzkuMTA4NDYgOC45ODQ1MyA4Ljc2NDgxIDkuMzIxMyA4LjM0MTQgOS4zMjEzQzcuOTE3OTggOS4zMjEzIDcuNTc0MzQgOC45ODQ1MyA3LjU3NDM0IDguNTY5NTlDNy41NzQzNCA4LjE1NDY0IDcuOTE3OTggNy44MTc4NyA4LjM0MTQgNy44MTc4N0M4Ljc2NDgxIDcuODE3ODcgOS4xMDg0NiA4LjE1NDY0IDkuMTA4NDYgOC41Njk1OVpNMTAuOTQ5NCA5LjMyMTNDMTEuMzcyOCA5LjMyMTMgMTEuNzE2NSA4Ljk4NDUzIDExLjcxNjUgOC41Njk1OUMxMS43MTY1IDguMTU0NjQgMTEuMzcyOCA3LjgxNzg3IDEwLjk0OTQgNy44MTc4N0MxMC41MjYgNy44MTc4NyAxMC4xODIzIDguMTU0NjQgMTAuMTgyMyA4LjU2OTU5QzEwLjE4MjMgOC45ODQ1MyAxMC41MjYgOS4zMjEzIDEwLjk0OTQgOS4zMjEzWiIgZmlsbD0iIzAwQTlEMCIvPgo8L3N2Zz4K' }
  };

  var LADIES = [
    { id: 'RL-884217', name: 'Anna S.', initials: 'AS', platform: 'realloves', status: 'online', unread: 6, chats: 14 },
    { id: 'FB-771903', name: 'Marina K.', initials: 'MK', platform: 'findbride', status: 'offline', unread: 0, chats: 8 },
    { id: 'RL-640122', name: 'Lena T.', initials: 'LT', platform: 'realloves', status: 'online', unread: 3, chats: 21 },
    { id: 'TT-593280', name: 'Olga D.', initials: 'OD', platform: 'talkytimes', status: 'online', unread: 12, chats: 5 },
    { id: 'LB-511477', name: 'Elena V.', initials: 'EV', platform: 'livebeam', status: 'error', unread: 0, chats: 17 },
    { id: 'CH-330845', name: 'Vera P.', initials: 'VP', platform: 'chatshouse', status: 'offline', unread: 1, chats: 9 }
  ];

  var MALES = [
    { id: '884217', name: 'Dmitri M.', initials: 'DM', time: '12:41', snippet: 'Sounds great, what time works for you?', unread: 2, status: 'online', flags: [] },
    { id: '551903', name: 'Andrey K.', initials: 'AK', time: '10:58', snippet: 'Can you send another photo of the garden?', unread: 0, status: 'online', flags: ['unanswered'], sla: '2h' },
    { id: '220144', name: 'Sergey V.', initials: 'SV', time: '09:32', snippet: 'Thank you! Talk tomorrow', unread: 0, status: 'offline', flags: [] },
    { id: '771265', name: 'Igor P.', initials: 'IP', time: 'Yesterday', snippet: 'Message could not be delivered', unread: 0, status: 'offline', flags: ['failed'] },
    { id: '309812', name: 'Leonid T.', initials: 'LT', time: 'Yesterday', snippet: 'Do you like jazz?', unread: 0, status: 'online', flags: ['flagged'] },
    { id: '640988', name: 'Pavel M.', initials: 'PM', time: 'Mon', snippet: 'The concert was amazing, thanks!', unread: 0, status: 'offline', flags: [] }
  ];

  var MAILS = [
    { id: 'M-101', from: 'Dmitri M.', initials: 'DM', subject: 'Re: Weekend plans', preview: 'I was thinking we could meet at that little place near…', time: '12:20', unread: true, status: 'delivered' },
    { id: 'M-102', from: 'Andrey K.', initials: 'AK', subject: 'Photos from my trip', preview: 'Attached are the pictures I promised — the mountains were…', time: '09:02', unread: true, status: 'delivered' },
    { id: 'M-103', from: 'Sergey V.', initials: 'SV', subject: 'About last night', preview: 'I really enjoyed our conversation, let me tell you more…', time: 'Yesterday', unread: false, status: 'opened' },
    { id: 'M-104', from: 'Igor P.', initials: 'IP', subject: 'Hello again', preview: 'It has been a while — how have you been? I wanted to…', time: 'Yesterday', unread: false, status: 'failed' },
    { id: 'M-105', from: 'Pavel M.', initials: 'PM', subject: 'Concert photos', preview: 'Here is the setlist and a few shots from the front row…', time: 'Mon', unread: false, status: 'opened' }
  ];

  var MESSAGES = [
    { dir: 'in', text: 'Hi! How was your weekend?', time: '11:42', status: '' },
    { dir: 'out', text: 'Pretty good — spent it hiking. Yours?', time: '11:58', status: 'Delivered', fb: { mode: 'manual', st: 'up' } },
    { dir: 'in', text: 'Lovely. I tried a new coffee place and thought of you. Fancy meeting there this week?', time: '12:36', status: '' },
    { dir: 'out', text: 'Sounds great, what time works for you?', time: '12:41', status: 'Read', fb: { mode: 'ai', st: 'down', comment: 'Too generic — name the café and keep it warmer.' } },
    { dir: 'out', text: 'I know a quiet spot by the river — their flat white is genuinely good. Thursday, 7 pm?', time: '12:44', status: 'Delivered', fb: { mode: 'ai', st: 'lineage' } }
  ];

  var TEMPLATES = [
    { id: 'T-2201', type: 'Chat invite', name: 'Morning coffee opener', text: 'Good morning! I just made my coffee and wondered how your day started…', status: 'active', used: 142, conv: '18%' },
    { id: 'T-2202', type: 'Chat invite', name: 'Weekend plans', text: 'Any exciting plans for the weekend? I am thinking of a small getaway…', status: 'active', used: 97, conv: '14%' },
    { id: 'T-2203', type: 'Chat invite', name: 'Evening check-in', text: 'Evening! How was your day — anything worth telling over a glass of wine?', status: 'active', used: 118, conv: '16%' },
    { id: 'T-2210', type: 'Chat invite', name: 'Photo compliment', text: 'Your profile caught my eye — you have a very warm smile. How is your week going?', status: 'active', used: 204, conv: '21%' },
    { id: 'T-2305', type: 'Welcome letter', name: 'First hello', text: 'Hello! I am new here and your profile stood out — I would love to hear your story…', status: 'active', used: 76, conv: '12%' },
    { id: 'T-3387', type: 'Welcome letter', name: 'Warm welcome', text: 'Welcome! I noticed your profile and would love to know more about you…', status: 'on_moderation', used: 0, conv: '—' },
    { id: 'T-4109', type: 'Icebreaker msg', name: 'Rainy day', text: 'It is pouring outside — perfect weather for a long conversation. What keeps you busy today?', status: 'active', used: 154, conv: '19%' },
    { id: 'T-4110', type: 'Icebreaker mail', name: 'Travel question', text: 'If you could fly anywhere tomorrow, where would you go and why?', status: 'active', used: 233, conv: '22%' },
    { id: 'T-4111', type: 'Icebreaker message', name: 'Music match', text: 'I saw you like jazz — any favourite artist? I am a Norah Jones fan…', status: 'declined', used: 51, conv: '9%' },
    { id: 'T-4120', type: 'Icebreaker msg', name: 'Food talk', text: 'Random question: what is the one dish you could eat every day? I am a pasta person…', status: 'active', used: 89, conv: '15%' },
    { id: 'T-5220', type: 'Newsfeed post', name: 'Sunday snapshot', text: 'Lazy Sunday with my cat and a good book. What does your perfect Sunday look like?', status: 'approved', used: 88, conv: '—' },
    { id: 'T-5224', type: 'Newsfeed post', name: 'Morning run', text: 'Started the day with a run by the river — feeling unstoppable. How do you recharge?', status: 'active', used: 64, conv: '—' }
  ];

  var GROUPS = [
    { id: 'G-12', name: 'New contacts — week 1', items: 12, status: 'active' },
    { id: 'G-13', name: 'Re-engagement', items: 8, status: 'active' },
    { id: 'G-14', name: 'Holiday set', items: 5, status: 'paused' }
  ];

  var HISTORY = [
    { id: 'H-88', lady: 'Anna S.', ladyInit: 'AS', male: 'Dmitri M.', maleInit: 'DM', platform: 'realloves', kind: 'chat', msgs: 214, last: '12:41', reason: 'Archived — 30d inactive' },
    { id: 'H-87', lady: 'Anna S.', ladyInit: 'AS', male: 'Victor R.', maleInit: 'VR', platform: 'realloves', kind: 'mail', msgs: 9, last: 'Aug 28', reason: 'Completed thread' },
    { id: 'H-86', lady: 'Marina K.', ladyInit: 'MK', male: 'Oleg S.', maleInit: 'OS', platform: 'findbride', kind: 'chat', msgs: 56, last: 'Aug 21', reason: 'Male deleted account' },
    { id: 'H-85', lady: 'Lena T.', ladyInit: 'LT', male: 'Petr N.', maleInit: 'PN', platform: 'realloves', kind: 'chat', msgs: 340, last: 'Aug 12', reason: 'Archived — 30d inactive' },
    { id: 'H-84', lady: 'Olga D.', ladyInit: 'OD', male: 'Sam K.', maleInit: 'SK', platform: 'talkytimes', kind: 'mail', msgs: 22, last: 'Aug 10', reason: 'Completed thread' },
    { id: 'H-83', lady: 'Elena V.', ladyInit: 'EV', male: 'Mark D.', maleInit: 'MD', platform: 'livebeam', kind: 'chat', msgs: 178, last: 'Aug 06', reason: 'Platform banned male' },
    { id: 'H-82', lady: 'Vera P.', ladyInit: 'VP', male: 'Alex G.', maleInit: 'AG', platform: 'chatshouse', kind: 'chat', msgs: 91, last: 'Aug 02', reason: 'Archived — 30d inactive' },
    { id: 'H-81', lady: 'Anna S.', ladyInit: 'AS', male: 'Roman T.', maleInit: 'RT', platform: 'realloves', kind: 'mail', msgs: 14, last: 'Jul 28', reason: 'Male deleted account' }
  ];

  var ADMINS = [
    { id: 'A-01', name: 'Katerina V.', initials: 'KV', role: 'Super admin', email: 'katerina@flow.local', last: 'online now' },
    { id: 'A-02', name: 'Igor B.', initials: 'IB', role: 'Moderator', email: 'igor@flow.local', last: '2h ago' },
    { id: 'A-03', name: 'Sofia L.', initials: 'SL', role: 'Content manager', email: 'sofia@flow.local', last: 'Yesterday' }
  ];

  var ACCOUNTS = [
    { id: 'ACC-114', login: 'anna_s_rl', lady: 'Anna S.', platform: 'realloves', siteId: 'RL-884217', status: 'ok', assigned: 'Katerina V.' },
    { id: 'ACC-115', login: 'marina_k_fb', lady: 'Marina K.', platform: 'findbride', siteId: 'FB-771903', status: 'ok', assigned: 'Igor B.' },
    { id: 'ACC-116', login: 'elena_v_lb', lady: 'Elena V.', platform: 'livebeam', siteId: 'LB-511477', status: 'error', assigned: '—' },
    { id: 'ACC-117', login: 'olga_d_tt', lady: 'Olga D.', platform: 'talkytimes', siteId: 'TT-593280', status: 'ok', assigned: 'Sofia L.' },
    { id: 'ACC-118', login: 'lena_t_rl', lady: 'Lena T.', platform: 'realloves', siteId: 'RL-640122', status: 'ok', assigned: 'Katerina V.' },
    { id: 'ACC-119', login: 'vera_p_ch', lady: 'Vera P.', platform: 'chatshouse', siteId: 'CH-330845', status: 'paused', assigned: 'Igor B.' }
  ];

  var PROFILES = [
    { id: 'P-771', name: 'Anna S.', initials: 'AS', age: 27, group: 'Group A — Eastern Europe', platforms: ['realloves'], status: 'live' },
    { id: 'P-772', name: 'Marina K.', initials: 'MK', age: 31, group: 'Group A — Eastern Europe', platforms: ['findbride'], status: 'live' },
    { id: 'P-773', name: 'Elena V.', initials: 'EV', age: 24, group: 'Group B — Test', platforms: ['livebeam'], status: 'paused' },
    { id: 'P-774', name: 'Vera P.', initials: 'VP', age: 29, group: '—', platforms: ['chatshouse'], status: 'draft' }
  ];

  var SCHEDULES = [
    { id: 'S-31', lady: 'Anna S. + 3', operator: 'Katerina V.', window: '08:00–16:00', days: 'Mon–Fri', tz: 'Kyiv · UTC+3', status: 'active' },
    { id: 'S-32', lady: 'Marina K. + 5', operator: 'Igor B.', window: '16:00–00:00', days: 'Mon–Sat', tz: 'Kyiv · UTC+3', status: 'active' },
    { id: 'S-33', lady: 'Olga D. + 2', operator: 'Sofia L.', window: '10:00–20:00', days: 'Sat–Sun', tz: 'Kyiv · UTC+3', status: 'paused' },
    { id: 'S-34', lady: 'Lena T. + 4', operator: 'Roman T.', window: '00:00–08:00', days: 'Daily', tz: 'Kyiv · UTC+3', status: 'active' }
  ];

  var ALERTS = [
    { id: 'AL-9', kind: 'err', icon: 'warn', title: 'Delivery failure spike on LiveBeam', body: '14 messages failed in the last hour — platform API timeouts.', time: '12:03', target: 'chats.html' },
    { id: 'AL-8', kind: 'warn', icon: 'limit', title: 'Chat limit reached: Elena V.', body: 'LiveBeam daily chat cap hit. Autoreplies paused until reset.', time: '11:47', target: 'tools-autoreplies.html' },
    { id: 'AL-7', kind: 'warn', icon: 'blacklist', title: 'Blacklist match: male 771265', body: 'Igor P. matched credit-history blacklist on RealLoves.', time: '10:31', target: 'tools-blacklists.html' },
    { id: 'AL-6', kind: 'ok', icon: 'check', title: 'Moderation backlog cleared', body: '12 icebreaker mails approved — queue is empty.', time: '09:55', target: 'campaigns-templates.html' },
    { id: 'AL-5', kind: 'info', icon: 'newsfeed', title: 'Newsfeed post scheduled', body: '“Sunday snapshot” goes live for Anna S. at 14:00.', time: '09:12', target: 'campaigns-posts.html' }
  ];

  var ALERT_FEED = {
    delivery: [
      { icon: 'warn', color: 'danger', t1: 'Reply to Andrey K. failed to deliver', t2: 'RealLoves gateway 502 · the message is queued for retry · thread stays open', time: '12:03', act: '<button type="button" class="btn btn--danger btn--sm" data-toast="Retry queued">Retry now</button>' },
      { icon: 'warn', color: 'danger', t1: '14 sends timed out on LiveBeam', t2: 'Platform API degraded · queue holds until the endpoint recovers', time: '11:58', act: '<a class="btn btn--ghost btn--sm" href="chats.html">Chats</a>' },
      { icon: 'mail', color: 'warning', t1: 'Mail to Igor P. bounced', t2: 'FindBride returned "mailbox unavailable" · mail stays in drafts', time: '10:20', act: '<a class="btn btn--ghost btn--sm" href="mails.html">Mails</a>' },
      { icon: 'check', color: 'success', t1: 'Overnight queue flushed', t2: '312 queued sends delivered after the 08:00 window opened', time: '08:05', act: '' }
    ],
    limits: [
      { icon: 'clock', color: 'warning', t1: 'RealLoves hourly send limit reached', t2: 'RL-884217 · invites paused · counter resets 14:00 — queued sends resume automatically', time: '13:12', act: '<a class="btn btn--ghost btn--sm" href="admin-account-edit.html">Account</a>' },
      { icon: 'clock', color: 'warning', t1: 'LiveBeam daily chat cap: Elena V.', t2: 'Cap hit at 17 open chats · autoreplies paused until reset', time: '11:47', act: '<a class="btn btn--ghost btn--sm" href="tools-autoreplies.html">Autoreplies</a>' },
      { icon: 'clock', color: 'muted', t1: 'TalkyTimes nearing mail quota', t2: 'TT-593280 at 80% of daily mail quota', time: '09:40', act: '' }
    ],
    blacklists: [
      { icon: 'blacklist', color: 'warning', t1: 'Igor P. tried to message Anna S.', t2: 'He is on the chat blacklist · message dropped · thread archived', time: '11:47', act: '<a class="btn btn--ghost btn--sm" href="tools-blacklists.html">Blacklist</a>' },
      { icon: 'blacklist', color: 'danger', t1: 'Credit-fraud match: male 771265', t2: 'Matched the shared credit-history blacklist on RealLoves', time: '10:31', act: '<a class="btn btn--ghost btn--sm" href="tools-blacklists.html">Review</a>' },
      { icon: 'blacklist', color: 'muted', t1: 'Bookmark flagged: Dmitri M.', t2: 'Bookmarked male asked for off-platform contact — watch list', time: '08:15', act: '' }
    ],
    moderation: [
      { icon: 'declined', color: 'danger', t1: '“Music match” declined by RealLoves', t2: 'Reason: mentions external site · edit the copy and resubmit', time: '09:30', act: '<a class="btn btn--ghost btn--sm" href="campaigns-templates.html?state=declined">Open declined</a>' },
      { icon: 'check', color: 'success', t1: 'Moderation backlog cleared', t2: '12 icebreaker mails approved overnight — queue is empty', time: '09:55', act: '' },
      { icon: 'templates', color: 'muted', t1: '“Warm welcome” under review', t2: 'Submitted 2h ago · typical review time ~3h', time: '11:02', act: '<a class="btn btn--ghost btn--sm" href="campaigns-templates.html?state=moderation">Queue</a>' }
    ],
    feedback: [
      { icon: 'digest', color: 'accent', t1: 'Weekly feedback digest ready', t2: '412 votes this month · coverage 79% of eligible · top negative reason: unnatural tone', time: 'Mon 09:00', act: '<a class="btn btn--ghost btn--sm" href="admin-message-feedback.html">Open review</a>' },
      { icon: 'clock', color: 'warning', t1: 'Lineage pending: 61 rows', t2: 'AI votes collected before lineage resolved — retained, excluded from verified AI KPIs', time: '12:41', act: '<a class="btn btn--ghost btn--sm" href="admin-message-feedback.html">Coverage</a>' },
      { icon: 'check', color: 'success', t1: 'Coverage milestone: 79%', t2: 'Rated/eligible crossed the 75% pilot target for the first time', time: 'Sep 9', act: '' }
    ]
  };

  var COVERAGE = {
    ops: ['Katerina V.', 'Igor B.', 'Sofia L.', 'Roman T.', 'Alina P.'],
    /* 0 none · 1 light · 2 medium · 3 full · -1 gap-alert */
    grid: [
      [0,0,0,0,0,0,0,0,2,3,3,3,2,2,3,3,2,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,1,2,3,3,3,3,3,3,3,2,1,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,3,3,3,3,3,2,1,0],
      [0,0,0,0,0,0,0,1,2,2,2,-1,-1,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,0,0]
    ]
  };

  var STATS = [
    { metric: 'Autoreplies sent', today: 412, week: 2880, trend: '+12%' },
    { metric: 'Chat invites accepted', today: 96, week: 640, trend: '+8%' },
    { metric: 'Welcome letters opened', today: 188, week: 1240, trend: '+21%' },
    { metric: 'Icebreakers replied', today: 74, week: 512, trend: '-3%' }
  ];

  /* ---- FLOW-8555 Message Feedback ---- */
  var FB_SUM = { rated: 412, eligible: 518, pos: 286, r24: 301, r72: 352, d1: 61, d7: 44, verified: 268, missing: 61, nonai: 83, updated: 'Today 12:41',
    aiPos: 205, aiN: 268, manPos: 66, manN: 83, medTtf: '3.4h', wowRated: '+14%', wowPos: '+3pp',
    commented: 174, negTotal: 126, negWithReason: 89, reviewersActive: 4, reviewersTotal: 5 };

  /* Send → vote lag distribution across rated messages (sums to 412). */
  var FB_TTF = [
    { l: '< 1h', n: 96 }, { l: '1–4h', n: 142 }, { l: '4–24h', n: 121 }, { l: '> 24h', n: 53 }
  ];

  /* Positive rate per generation model — verified AI lineage only (n sums
     to 268, weighted rate ≈ fleet 76.5%). Δpp measured vs the fleet AI rate,
     not manual. */
  var FB_MODELS = [
    { name: 'GPT-4o mini', n: 141, pos: 70 },
    { name: 'Grok 4.1 Fast', n: 82, pos: 82 },
    { name: 'Claude Haiku 4.5', n: 45, pos: 87 }
  ];

  /* Reason-chip distribution across negative votes (v1.1). */
  var FB_REASONS = [
    { l: 'Unnatural tone', n: 34 },
    { l: 'Ignored context', n: 21 },
    { l: 'Too pushy', n: 14 },
    { l: 'Timing off', n: 11 },
    { l: 'Wrong language', n: 9 }
  ];

  /* Reviewer coverage + inter-rater agreement on double-rated messages.
     Agreement measures rater consistency — never message truth. */
  var FB_REVIEWERS = [
    { name: 'Kira M.', role: 'Main Admin', rated: 148, pos: 71, dbl: 41, agr: 82 },
    { name: 'Denis A.', role: 'Admin', rated: 121, pos: 66, dbl: 38, agr: 78 },
    { name: 'Sofia R.', role: 'Admin', rated: 97, pos: 69, dbl: 33, agr: 74 },
    { name: 'Max B.', role: 'Admin', rated: 46, pos: 80, dbl: 12, agr: 67 }
  ];

  /* Positive-rate slice matrix: platform × origin. null = insufficient
     coverage — rendered as unknown, never as 0%. */
  var FB_SLICE = [
    { p: 'realloves',  name: 'CouldSee / RealLoves', ai: { v: 79, n: 112 }, tpl: { v: 74, n: 38 }, man: { v: 82, n: 36 } },
    { p: 'findbride',  name: 'FindBride',            ai: { v: 71, n: 64 },  tpl: { v: 69, n: 22 }, man: { v: 80, n: 18 } },
    { p: 'chatshouse', name: 'ChatsHouse',           ai: { v: 83, n: 58 },  tpl: null,             man: { v: 77, n: 13 } },
    { p: 'talkytimes', name: 'TalkyTimes',           ai: null,              tpl: { v: 72, n: 14 }, man: { v: 75, n: 9 } },
    { p: 'livebeam',   name: 'LiveBeam',             ai: { v: 68, n: 34 },  tpl: { v: 66, n: 11 }, man: { v: 70, n: 7 } }
  ];

  var FB_DAILY = [
    { d: 'Sep 1', pos: 38, neg: 9, pending: 2, unknown: 1 },
    { d: 'Sep 2', pos: 41, neg: 8, pending: 1, unknown: 0 },
    { d: 'Sep 3', pos: 35, neg: 11, pending: 0, unknown: 2 },
    { d: 'Sep 4', pos: 44, neg: 7, pending: 3, unknown: 1 },
    { d: 'Sep 5', pos: 39, neg: 12, pending: 0, unknown: 0 },
    { d: 'Sep 6', pos: 29, neg: 6, pending: 1, unknown: 3 },
    { d: 'Sep 7', pos: 33, neg: 10, pending: 0, unknown: 1 },
    { d: 'Sep 8', pos: 46, neg: 8, pending: 4, unknown: 0 },
    { d: 'Sep 9', pos: 51, neg: 9, pending: 2, unknown: 2 },
    { d: 'Sep 10', pos: 42, neg: 13, pending: 0, unknown: 1 }
  ];

  var FB_REPLY = [
    { d: 'Sep 2', h24: 71, h72: 84, n: 44, pending: 2, unknown: 1 },
    { d: 'Sep 3', h24: 68, h72: 82, n: 46, pending: 0, unknown: 2 },
    { d: 'Sep 4', h24: 74, h72: 86, n: 51, pending: 3, unknown: 1 },
    { d: 'Sep 5', h24: 70, h72: 83, n: 51, pending: 0, unknown: 0 },
    { d: 'Sep 6', h24: 76, h72: 88, n: 35, pending: 1, unknown: 3 },
    { d: 'Sep 7', h24: 72, h72: 85, n: 43, pending: 0, unknown: 1 },
    { d: 'Sep 8', h24: 78, h72: 89, n: 54, pending: 4, unknown: 0 },
    { d: 'Sep 9', h24: 74, h72: null, n: 60, pending: 2, unknown: 2 }
  ];

  var FB_COHORTS = [
    { d: 'Aug 27', size: 58, d1: 62, d7: 45, cov: 'complete' },
    { d: 'Aug 30', size: 61, d1: 59, d7: 43, cov: 'complete' },
    { d: 'Sep 2', size: 44, d1: 64, d7: 47, cov: 'complete' },
    { d: 'Sep 5', size: 51, d1: 60, d7: 42, cov: 'complete' },
    { d: 'Sep 7', size: 43, d1: 63, d7: 44, cov: 'complete' },
    { d: 'Sep 8', size: 54, d1: 58, d7: 46, cov: 'complete' },
    { d: 'Sep 9', size: 60, d1: 57, d7: null, cov: 'pending' },
    { d: 'Sep 10', size: 55, d1: null, d7: null, cov: 'unknown' }
  ];

  var FB_WEAK = [
    { reason: 'neg', reasonTxt: 'Negative feedback', platform: 'realloves', msg: '“Sounds great, what time works for you?”', comment: 'Too generic — name the café and keep it warmer.', who: 'Anna S. → Dmitri M.', date: 'Sep 10 · 12:41', cov: 'complete', href: 'chats.html?msg=msg-4821' },
    { reason: 'neg', reasonTxt: 'Negative feedback', platform: 'livebeam', msg: '“I was just thinking about you and wanted to say hi :)”', comment: 'Reads like a mass template, not a reply.', who: 'Elena V. → Mark D.', date: 'Sep 9 · 18:12', cov: 'complete', href: 'chats.html?msg=msg-4779' },
    { reason: 'd7', reasonTxt: 'D7 miss — confirmed', platform: 'findbride', msg: '“I would love to hear more about your garden.”', comment: '', who: 'Marina K. → Oleg S.', date: 'Sep 2 · 09:15', cov: 'complete', href: 'chats.html?msg=msg-3102' },
    { reason: 'noreply', reasonTxt: 'No reply — window confirmed', platform: 'talkytimes', msg: '“Quick question — coffee or tea person?”', comment: '', who: 'Olga D. → Sam K.', date: 'Sep 7 · 14:02', cov: 'complete', href: 'chats.html?msg=msg-4507' },
    { reason: 'neg', reasonTxt: 'Negative feedback', platform: 'realloves', msg: '“I know a quiet spot by the river — their flat white is genuinely good.”', comment: 'Better. Still a bit stiff for a second message.', who: 'Anna S. → Dmitri M.', date: 'Sep 10 · 12:44', cov: 'complete', href: 'chats.html?msg=msg-4824' },
    { reason: 'noreply', reasonTxt: 'No reply — window confirmed', platform: 'chatshouse', msg: 'Content expired', comment: '', who: 'Vera P. → Alex G.', date: 'Sep 5 · 20:31', cov: 'complete', href: 'chats.html?msg=msg-3958', expired: true },
    { reason: 'neg', reasonTxt: 'Negative feedback', platform: 'findbride', msg: '“Your photos are stunning, where were they taken?”', comment: 'AI output misread his bio — he mentioned the place already.', who: 'Marina K. → Igor P.', date: 'Sep 4 · 11:26', cov: 'complete', href: 'mails.html?msg=msg-3611' },
    { reason: 'd7', reasonTxt: 'D7 miss — confirmed', platform: 'realloves', msg: '“Hope your week is treating you well.”', comment: '', who: 'Lena T. → Petr N.', date: 'Aug 30 · 16:45', cov: 'pending', href: 'chats.html?msg=msg-2780' },
    { reason: 'neg', reasonTxt: 'Negative feedback', platform: 'livebeam', msg: '“I dream about us cooking dinner together someday.”', comment: 'Escalates intimacy too fast for message 3.', who: 'Elena V. → Roman T.', date: 'Aug 29 · 13:58', cov: 'unknown', href: 'chats.html?msg=msg-2644' }
  ];

  /* -- Role model ----------------------------------------------------------
     Mirrors src/router.jsx checkRole() + ProtectedLayout roleMenus:
       account    — operator: full workspace + campaigns, no admin zone.
                    Operators also rate outgoing/AI output (fb: true) — the
                    management screen stays admin/main_admin only.
       admin      — workspace + admin zone, but NOT auto_sendings /
                    icebreakers / newsfeeds (account-only in v1 →
                    campaigns-groups/campaigns-posts here) and NOT the
                    Administrators screens (main_admin only)
       main_admin — admin zone + tools + monitor + alerts; the router gates
                    chats/mails/history/statistics to [account, admin], so
                    the operator surfaces are denied for this role.
                    omniscience: v1 showed it to every role on dev/stage;
                    FLOW-8555 tightens it to admin/main_admin.
     SCREEN_ROLES is keyed by file name — every shipped screen must appear. */
  var ROLES = {
    /* `all` is a preview-only lens for the atlas/design review — nothing is
       gated, every screen and every feedback control renders. It is not a
       product role: v1 has only the three below. */
    all:        { name: 'Katerina V.', label: 'All roles',  home: 'home.html',  fb: true, preview: true },
    account:    { name: 'Anna K.',     label: 'Operator',   home: 'home.html',  fb: true },
    admin:      { name: 'Katerina V.', label: 'Admin',      home: 'home.html',  fb: true },
    main_admin: { name: 'Max R.',      label: 'Main admin', home: 'admin.html', fb: true }
  };
  var ROLE_ALL = ['account', 'admin', 'main_admin'];
  var ROLE_OPS = ['account', 'admin'];
  var ROLE_MNG = ['admin', 'main_admin'];
  var ROLE_MA  = ['main_admin'];
  var SCREEN_ROLES = {
    'login.html': ROLE_ALL,
    'home.html': ROLE_OPS, 'inbox.html': ROLE_OPS, 'chats.html': ROLE_OPS,
    'mails.html': ROLE_OPS, 'history.html': ROLE_OPS, 'statistics.html': ROLE_OPS,
    'scorecard.html': ROLE_OPS, 'omniscience.html': ROLE_MNG, 'alerts.html': ROLE_ALL,
    'campaigns.html': ROLE_OPS, 'campaigns-templates.html': ROLE_OPS,
    'campaigns-create.html': ROLE_OPS, 'campaigns-history.html': ROLE_OPS,
    'campaigns-performance.html': ROLE_OPS, 'planner.html': ROLE_OPS,
    'campaigns-groups.html': ['account'], 'campaigns-posts.html': ['account'],
    'tools.html': ROLE_ALL, 'tools-autoreplies.html': ROLE_ALL, 'tools-mailing.html': ROLE_ALL,
    'tools-presets.html': ROLE_ALL, 'tools-blacklists.html': ROLE_ALL,
    'tools-blacklist-new.html': ROLE_ALL, 'lady-360.html': ROLE_ALL,
    'admin.html': ROLE_MNG, 'admin-accounts.html': ROLE_MNG, 'admin-account-new.html': ROLE_MNG,
    'admin-account-edit.html': ROLE_MNG, 'admin-lady-profiles.html': ROLE_MNG,
    'admin-lady-verify.html': ROLE_MNG, 'admin-lady-commit.html': ROLE_MNG,
    'admin-lady-edit.html': ROLE_MNG, 'admin-lady-group-edit.html': ROLE_MNG,
    'admin-schedules.html': ROLE_MNG, 'admin-schedule-new.html': ROLE_MNG,
    'admin-message-feedback.html': ROLE_MNG, 'admin-coverage.html': ROLE_MNG,
    'monitor.html': ROLE_MNG,
    'admin-administrators.html': ROLE_MA, 'admin-admin-new.html': ROLE_MA,
    'admin-admin-edit.html': ROLE_MA
  };
  function roleAllows(file, role) {
    if (role === 'all') return true;
    var r = SCREEN_ROLES[file];
    return !r || r.indexOf(role) !== -1;
  }

  window.Fixtures = {
    PLATFORMS: PLATFORMS, LADIES: LADIES, MALES: MALES, MAILS: MAILS, MESSAGES: MESSAGES,
    TEMPLATES: TEMPLATES, GROUPS: GROUPS, HISTORY: HISTORY, ADMINS: ADMINS,
    ACCOUNTS: ACCOUNTS, PROFILES: PROFILES, SCHEDULES: SCHEDULES, ALERTS: ALERTS,
    ALERT_FEED: ALERT_FEED, COVERAGE: COVERAGE, STATS: STATS,
    FB_SUM: FB_SUM, FB_DAILY: FB_DAILY, FB_REPLY: FB_REPLY, FB_COHORTS: FB_COHORTS, FB_WEAK: FB_WEAK,
    FB_REASONS: FB_REASONS, FB_REVIEWERS: FB_REVIEWERS, FB_SLICE: FB_SLICE,
    FB_TTF: FB_TTF, FB_MODELS: FB_MODELS,
    ROLES: ROLES, SCREEN_ROLES: SCREEN_ROLES, roleAllows: roleAllows
  };
})();
