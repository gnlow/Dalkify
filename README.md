# Dalkify
[Dalkak](https://github.com/gnlow/Dalkak/) 기반의 블록 패키지를 다른 플랫폼에서 사용 가능하게 해주는 크롬 확장 프로그램입니다.  
현재는 엔트리 플랫폼만 지원하고 있습니다.
엔트리 [만들기](https://playentry.org/ws)와 작품 페이지 접속 시 자동으로 실행됩니다.

엔트리 작품에 "dalk_pack" 리스트를 추가하고 원하는 블록 패키지 이름을 항목에 추가하면 사용할 수 있습니다.

블록 패키지는 [npm](https://npm.im/) 기반으로 배포됩니다. (Dalkify는 클라이언트에서 [unpkg](https://unpkg.com)를 이용해 패키지를 불러옵니다.)

블록 패키지 예시:
- [Kachi](https:/github.com/Dalkak/Kachi/): WebSocket 관련 기능을 제공합니다.
- [JSON](https:/github.com/Dalkak/JSON/): JSON 및 Object 관련 기능을 제공합니다.
