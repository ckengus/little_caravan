# 현재 상태 / 다음 작업

최종 갱신: 2026-10-29 (한국시간).

## 현재 마일스톤

**M1 로컬·원격 CI 검증과 Pages 배포 성공. 배포 후 사용자 접속·조작 확인 대기.** M2는 간결한 전투 연출로 전환했으며 실제 휴대폰 검수는 별도다.

## 완료된 기능

- Node 24.19.0 + TypeScript/Vite/Phaser 프로젝트, package-lock.json, 설치·개발·빌드·미리보기 명령.
- `?scene=character-lab` 테스트 필드: 평지·발 기준선·임시 주인공·더미·반응형 HTML 조작 패널.
- 대기/걷기/베기/찌르기/대쉬/돌진 베기/경직/넉백→넘어짐→기상 상태와 임시 도형 표현. 정상 행동 후 동일 대기로 복귀하며 이동 후 좌표 유지.
- 수동/자동 전환, 더미 투입·제거·전체 초기화, 자동 접근→범위 정지→공격. 더미 HP·피격 색·작은 밀려남.
- 상태·프레임·위치·게임 시간·HP·타격 횟수 표시. 0.25/0.5/1배, 정지와 다음 프레임 경계까지 전체 게임 시간 진행.
- 발 원점·그립·별도 검 선분·전방 공격 범위 표시/숨김. 공격 중 방향 고정·다른 공격 무시·CC 중단 및 남은 타격 취소.
- 걷기 Pointer Events 해제/취소/버튼 이탈/캡처 상실/포커스 상실/페이지 비표시 시 입력 해제. A/D·방향키·Space 지원.
- CI와 main Pages 배포 워크플로 작성. **원격 Validate 성공 확인. Pages는 저장소 설정 단계에서 실패.**

## 실행·검증 결과

2026-10-29 클라우드 환경에서 실제 실행:

| 검증 | 결과 |
| --- | --- |
| `npm ci --no-audit --no-fund` | 성공, 잠금 파일 재설치 확인 |
| `npm run typecheck` | 통과 |
| `npm test` | Vitest 1파일, 9개 통과 |
| `npm run build` | 성공, dist 생성. Phaser 청크 크기 경고 존재 |
| `npm run test:browser` | Chromium desktop/Pixel 7 에뮬레이션 각 3개, 총 6개 통과 |
| 브라우저 오류·404 | 스모크 중 콘솔 오류/pageerror/HTTP 400 이상 없음 |
| 브라우저 기능 | 로딩, 자동 접근·타격, 정지/프레임 진행, 초기화, 걷기 취소 5종, 키보드, 수동 버튼, 배속 선택, 디버그 토글, 더미 제거 확인 |
| 레이아웃 | 1280×720 PC와 Pixel 7 세로 에뮬레이션에서 가로 overflow 없음. 모바일 스크린샷 직접 확인 |
| 모바일 실기기·가로 회전·앱 복귀·성능 | 미검증 |
| 원격 GitHub CI / Pages 배포 / 공개 URL | 원격 Validate 성공, PR #1 main 병합 완료. Deploy Pages 빌드는 성공했으나 configure-pages에서 Pages 미활성화 관련 404로 실패 |
| APK | 미착수 |

단위 테스트는 공격당 1회 피해, 거리/방향/정확한 사거리 경계, CC 타격 취소·경직 갱신, 공격 입력 거부·방향 잠금, 정지/배속/프레임 진행 시간, 자동 접근, 넉백 이후 위치 유지·추가 넉다운 무시, 필드 경계·reset을 검증한다. 부동소수점 프레임 경계에서 진행이 정체되는 문제를 수정하고 재검증했다.

브라우저 다운로드는 cdn.playwright.dev에서 정책 403으로 실패했으므로 이미 설치된 `/usr/bin/chromium`으로 검증했다. 브라우저 테스트는 시스템 Chromium이 없으면 Playwright 설치 브라우저를 선택한다. 스크린샷은 재생성 가능한 ignored `test-results/lab-desktop.png`, `lab-mobile.png`에 있다.

## 실행·확인 방법

저장소 루트에서 `npm ci` → `npm run dev` 후 개발 서버의 `/?scene=character-lab`에 접속한다. `npm run build` → `npm run preview`로 빌드 결과 확인 가능. 배포 성공 주소: https://ckengus.github.io/little_caravan/?scene=character-lab . 배포 후 실제 렌더링·조작은 사용자 확인 대기.

더미 투입→자동 접근·공격 체크→HP 감소 확인. 일시정지 후 한 프레임 진행으로 상태·타격 시점 확인. 전체 초기화 후 걷기 버튼을 누르고 떼거나 버튼 밖으로 이동해 정지 확인. 경직/넉백은 공격을 중단한다. UI와 도형은 검사 도구이며 정식 게임이 아니다.

## 진행·차단·한계

- PR [#1](https://github.com/ckengus/little_caravan/pull/1)을 생성해 main에 병합했다. 병합 커밋: 8db6a5aec5d34b29a5ae751a533e6a7f3ac707c0. GitHub 연결 도구를 통해 처리했으며 별도 클라우드 Codex 환경의 네트워크 정책을 변경한 것은 아니다.
- 브랜치 HEAD bdceeec의 [Validate](https://github.com/ckengus/little_caravan/actions/runs/40872358715)에서 설치·타입 검사·단위 테스트·빌드·브라우저 테스트 성공을 확인했다.
- main의 [Deploy Pages](https://github.com/ckengus/little_caravan/actions/runs/40872851230)는 npm test와 build 성공 후 actions/configure-pages에서 실패했다. 로그는 Pages를 활성화하고 GitHub Actions 빌드로 설정하라는 안내와 404 Not Found다. 앱 코드 오류나 클라우드 네트워크 오류로 분류하지 않는다.
- 사용자 설정 필요: 저장소 Settings → Pages → Build and deployment → Source: GitHub Actions. 그 뒤 Actions → Deploy Pages → Run workflow(main) 또는 실패 실행 재시도. 실제 배포 성공/주소 접속은 아직 확인하지 않았다.
- 전체 M1 완료는 원격 CI·배포·접속 확인 후 판단한다.
- Phaser 청크 약 1.21 MB / gzip 332 kB 크기 경고. 모바일 실기기 성능과 로딩 품질은 미검증.
- 효과음 리소스와 재생 UI는 미구현, 오디오 비활성화.

## 임시 아트·누락 리소스 / M2

기존 일행 PNG를 직접 열어 외형 참고임을 확인했고 원본을 변경하지 않았다. 코드 도형의 검 각도 변화·이동·넘어짐 표시는 임시이며 정식 베기·찌르기·기상 애니메이션 완성이 아니다. M2 manifest와 리소스 교체 스키마도 아직 없다.

필요 리소스: 발 원점이 같은 게임용 전투 기본자세, 베기 준비/타격/마무리/회수 몸 프레임, 투명한 별도 검 2종, 앞손/뒷손 패치, 각 프레임 손잡이 피벗·레이어·양손 부착 데이터. 최종 작은 화면 그립과 타격감은 사용자 검수 대기. 다른 3명과 의상 양산은 미착수.

## 다음 작업

1. [M2 간결 전투 작업지시](tasks/M2_SIMPLE_COMBAT.md)를 따라 테스트 필드에 idle/attack 두 자세와 이펙트 연출을 구현한다.
2. 새 두 자세 아트를 준비하고 작은 화면에서 더미 타격을 확인한다. 현재 승인된 두 자세 소스는 아직 없다.
3. 사용자 시각 검수 후 나머지 3명으로 확대한다. 실제 휴대폰 검수는 별도로 기록한다.

## 2026-10-29 원격 인계 기록

GitHub 연결 도구로 CI 조회·PR 생성·병합과 배포 로그 확인을 수행했다. Pages 설정 변경 전이므로 테스트 URL을 확정해 제공하지 않았다. 현재 연결 도구에는 Pages 설정 변경 기능이 없어 사용자 계정에서 한 차례 설정이 필요하다.

## 2026-10-29 Pages 활성화 후 확인

- [Deploy Pages 실행 40876318386](https://github.com/ckengus/little_caravan/actions/runs/40876318386): build/deploy 모두 success.
- 배포된 앱 커밋: d2a4ae27959b2ef4e532015547339882e6223aa1. 동일 커밋 Validate 실행 40873135547도 success.
- 배포 로그의 실제 환경 주소: https://ckengus.github.io/little_caravan/ .
- [캐릭터 테스트 필드 열기](https://ckengus.github.io/little_caravan/?scene=character-lab)
- 이전 Pages 설정 404 차단은 해소됐다. 확인 도구에서 공개 페이지 본문을 열지 못해 배포 후 실제 렌더링·조작은 아직 검증하지 않았다. 사용자 브라우저에서 접속·더미 투입·자동 공격·일시정지·초기화를 확인한다.
- 정식 아트와 실제 휴대폰 검수는 별도이며 아직 완료가 아니다.

## M2 주인공 아트 v1 제작

2026-10-29, 게임용 주인공 전신 6자세·별도 검2종·손 전경·두 손 소켓·idle/slash manifest 초안을 만들었다. [소스와 Codex 적용 지침](../assets/art/source/hero/m2-v1/README.md)을 참고한다. 상태는 draft-needs-user-review다. 투명 PNG/가상 캔버스 경계/공통 ready 재사용/두 검 합성을 로컬 확인했다. 아직 Phaser 테스트 필드에는 적용하지 않았고 사용자 시각 승인도 없다. 기존 M1 임시 도형과 다른 세 캐릭터의 미제작 상태는 유지한다. 다음은 소스의 그립·복귀 검수와 M2 재생 어댑터 적용이다.

## 현재 최우선 결정 — 간결한 전투 연출

2026-10-29 사용자가 첫 번째 대안(idle1장+무기 포함 attack1장+이동/검 궤적/적 반응)을 채택했다. 앞선 M2 다자세/별도 검/손 소켓 아트는 자세가 어색하다는 피드백으로 미승인이다. 자산은 보존하되 이를 정식으로 통합하거나 소켓을 더 정교하게 만드는 작업은 우선하지 않는다. 새 기준은 ANIMATION_PIPELINE v0.2와 tasks/M2_SIMPLE_COMBAT.md다. 현재 코드/배포 화면은 변경하지 않았으며, 새 연출과 새 두 자세 아트는 아직 미구현/미제작이다.
