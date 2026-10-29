# 현재 상태 / 다음 작업

최종 갱신: 2026-10-29 (한국시간).

## 현재 마일스톤

**M2 간결 연출 파이프라인 로컬 구현·검증 완료. 승인 PNG·사용자 시각 승인·M2 원격 배포 대기.** 최신 main `ecc8f9d806eec34071d69e7734e6f4368a455a74`에서 시작했다. M1은 기존 CI·Pages 성공 이력이 있으며 아래 M2 검증과 구분한다.

## 완료된 기능

- 기존 Lab의 행동/위치/피해/더미 로직은 변경하지 않았다. M1 걷기·찌르기·대쉬·CC·배속·정지·프레임 진행·입력 취소 기능을 보존했다.
- `src/game/actorView.ts`: 렌더러와 독립된 게임 시간 기반 표현 샘플. idle/anticipation/impact/recover, 포즈/offset/rotation/검 궤적을 결정한다. 렌더러 타이머나 추가 피해 처리는 없다.
- `src/data/hero.ts`: 두 이미지 경로, 공통 발 원점, 표시 크기, 시각 단계, 효과 및 장비 ID/외형 ID 구분 데이터.
- 두 개의 직접 작성한 투명 임시 SVG: 대기와 무기/손 포함 공격 포즈. 전체 일러스트 흔들기 대신 실제 다른 두 포즈를 전환한다. 미승인 m2-v1 원본과 ZIP은 변경하지 않았다.
- 베기 0.0~0.2s 준비(idle), 0.2~0.3s 타격(attack+전진 10px+궤적), 0.3~0.6s 복귀(같은 idle). 타격 시작은 기존 actions hit/frame과 공유하며 타격 유지시간은 데이터에 있다. 찌르기/돌진 베기도 각 기존 hit 시점을 사용하지만 전용 자세는 없는 임시 대체다.
- 기존 더미 섬광·8px 실제 밀려남과 같은 피해 이벤트 시각에 광선을 표시한다. 모든 효과는 게임 시간으로 진행하고 정지 시 멈춘다.
- 월드 좌표와 별도 visualOffset. 제자리 베기는 월드 좌표 불변, dash/knockback은 도착 좌표 유지. 종료/CC/reset 시 남은 공격 포즈·궤적·offset을 제거한다.
- 좌우 반전과 효과 방향 반영. 디버그는 발 원점/공격 범위만 표시하며 존재하지 않는 무기 소켓을 표시하지 않는다.

## 이번 검증 결과

| 항목 | 결과 |
| --- | --- |
| `npm run build` (typecheck 포함) | 성공, SVG 2개 별도 해시 파일 및 dist 생성 |
| `npm test` | 2파일, 13개 통과 (기존 9 + 표현/피해 동기화·복원 4) |
| `npm run test:browser` | desktop/Pixel 7 에뮬레이션 총 8개 통과 (기존 6 + M2 2) |
| 브라우저 리소스·오류 | 스모크에서 pageerror/콘솔 오류/HTTP 400 이상 없음. 두 포즈 로딩·실제 전환 확인 |
| 작은 화면/좌우 | 모바일 타격·반전 스크린샷 생성, 투명 배경·바닥·포즈·궤적 확인. 가로 overflow 없음 |
| 일시정지/CC/reset | impact에서 포즈·궤적 정지, CC 시 제거, reset 복원, 좌측 offset -10 확인 |
| 원격 M2 CI·PR·배포 | GitHub API 403 차단. 결과 미확인, main 미변경 |
| 실제 휴대폰·사용자 시각 승인 | 미검증/대기 |

초기 브라우저 실행에서 Phaser가 Vite 인라인 SVG data URI를 atob로 해독하다 실패했다. `assetsInlineLimit: 0`으로 별도 URL 로딩을 적용하고 전체 8개 테스트를 재실행해 통과했다. Phaser 청크 1.21MB/gzip 332KB 경고는 남아 있으며 빌드 실패는 아니다.

검증 스크린샷: ignored `test-results/m2-impact-{desktop,mobile}.png`, `m2-impact-left-{desktop,mobile}.png`. 자동 통과는 시각 승인을 의미하지 않는다.

## 실행·검수 방법

`npm run dev` → `/?scene=character-lab`. 더미 투입→자동 접근·공격으로 포즈/궤적/피격 확인. 일시정지→베기→한 프레임 진행 2회로 impact 확인, 1회 추가로 같은 idle 복귀 확인. CC나 전체 초기화 후 궤적과 offset이 없어야 한다. 좌측을 향해 같은 동작을 반복한다.

기존 M1 배포 주소: https://ckengus.github.io/little_caravan/?scene=character-lab . **이번 M2 변경이 배포된 주소로 확인한 것은 아니다.** M2 main 병합/Pages 성공 후 새 화면 확인이 필요하다.

## 차단·누락 아트·제한

- 이 환경의 `gh api repos/ckengus/little_caravan` 재시도는 `https://api.github.com/...: Forbidden`. 이전 외부 연결 도구로 성공한 CI/Pages 이력과 별개이며 계정 권한 문제로 단정하지 않는다.
- 승인된 idle/attack PNG 없음. 필요한 정확한 규격은 [임시 포즈·PNG 교체 계약](../src/game/assets/README.md): 256×256 RGBA, 발 (128,234), 오른쪽 기본 방향, 표시 높이 160px. 검/손 포함 완성 포즈 2장 필요.
- 걷기/찌르기/대쉬/경직/넘어짐/기상 전용 아트는 미제작. idle 기울임·위치 이동 등 임시 대체이며 완료 아트가 아니다.
- 그림 속 기본 검은 고정. 실제 무기 교체 외형/소켓/장비 시스템은 미구현이며 현재 M2 필수 조건도 아니다.
- 오디오 리소스/재생은 미구현. 다른 3명·APK·실결제·서버는 범위 밖.

## 다음 작업

1. M2 브랜치의 CI 확인·main 병합 후 Pages 재배포 및 실제 앱 접속 검증.
2. 승인된 두 PNG 적용과 작은 화면의 포즈/타격감 사용자 검수.
3. 사용자 승인 후 다른 일행 확대. 실제 휴대폰 터치·회전·복귀·성능은 별도 검증.

## 이전 진행 이력 (당시 상태)

아래 기록의 '미구현/다음'은 당시 이력이다. 현재 기준은 위 M2 간결 연출과 ANIMATION_PIPELINE v0.2이며 별도 무기/손 소켓 실험을 재개하지 않는다.

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
