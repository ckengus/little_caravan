# Little Caravan

4명의 전 용병 동료가 새 상단을 꾸려 지역을 여행하며 물건을 사고팔고, 장비와 마차를 성장시키는 2D 방치형 거래·모험 게임.

**공동 기준 문서 v0.1 · 2026-10-29 (한국시간)**

## 처음 읽을 문서

1. [프로젝트 기획서](docs/PROJECT_PLAN.md): 무엇을 만드는지, 최종 결과와 범위.
2. [현재 상태](docs/STATUS.md): 실제 완료 항목, 다음 작업, 미완성 리소스.
3. [개발 로드맵](docs/ROADMAP.md): 단계별 작업과 완료 기준.
4. [개발환경·설계](docs/DEVELOPMENT.md): 웹·클라우드 개발과 배포.
5. [아트·애니메이션 제작 규격](docs/ANIMATION_PIPELINE.md): GPT와 Codex의 전달 계약.
6. [결정 기록](docs/DECISIONS.md): 확정·기본 채택·미정의 구분.
7. [에이전트 작업 규칙](AGENTS.md): 작업 시작·검증·보고·문서 갱신.

## 현재 상태와 첫 개발 목표

- M1 웹 테스트 필드·원격 CI·Pages 배포가 성공했다. [테스트 필드](https://ckengus.github.io/little_caravan/?scene=character-lab)에서 사용자 접속·조작 검수 대기.
- 첫 목표는 **웹 캐릭터 동작 테스트 필드**다. 정식 게임 UI나 APK부터 만들지 않는다.
- 선택된 외형: [아트 설명](assets/art/references/README.md) / [일행 PNG](assets/art/references/little-caravan-party-v1.png).
- 이 PNG는 외형 참고자료이며 완성된 애니메이션 시트나 분리 부품이 아니다.

## Codex 다음 작업

> AGENTS.md와 docs/STATUS.md를 읽고 docs/tasks/M2_SIMPLE_COMBAT.md를 구현한다. M1 테스트 필드를 보존하고 대기1장+무기 포함 공격1장+짧은 전진·검 궤적·적 반응 방식으로 전환한다. 기존 M2 다자세/별도 검 소켓 소스는 미승인 실험이며 현재 필수 방향이 아니다. 아트가 없으면 임시임을 표시하고 연출 파이프라인을 먼저 구현한다. 검증·웹 배포 결과와 STATUS/ROADMAP을 갱신한다.

## 실행·배포

Node 24.19.0 (`.nvmrc`), npm 11, TypeScript 5.9, Vite 7, Phaser 3.90을 사용한다.

```sh
npm ci
npm run dev
# 브라우저에서 개발 서버의 /?scene=character-lab 진입
npm run typecheck
npm test
npm run build
npm run preview
npm run test:browser
```

브라우저 테스트는 설치된 `/usr/bin/chromium`이 있으면 사용하며, 없으면 `npx playwright install --with-deps chromium`으로 설치한다. 테스트가 빌드 미리보기를 4173 포트에 직접 시작하므로 기존 미리보기는 먼저 종료한다.

걷기 버튼을 누르고 있거나 A/D·방향키로 이동, Space로 베기. 더미 투입 후 자동 접근·공격을 켤 수 있다. 재생 패널에서 배속·일시정지·한 프레임 진행과 디버그 표시를 조절한다. 대기/공격 두 SVG 포즈와 다른 행동 대체 표현은 임시이며 정식 승인 아트가 아니다.

CI는 설치→타입 검사→단위 테스트→빌드→브라우저 테스트를 실행한다. 기능 브랜치의 원격 Validate 성공을 확인했고 [PR #1](https://github.com/ckengus/little_caravan/pull/1)을 main에 병합했다. main의 Pages 배포는 빌드 성공 후 Pages 미활성화 관련 configure-pages 404로 실패했다.

저장소 [Settings → Pages](https://github.com/ckengus/little_caravan/settings/pages)에서 Build and deployment → Source를 **GitHub Actions**로 설정한다. 이후 Actions → Deploy Pages → Run workflow(main) 또는 실패 실행 재시도. 배포 성공과 실제 접속 확인 전까지 공개 테스트 URL은 미확정이다.


## 2026-10-29 Pages 활성화 후 확인

- [Deploy Pages 실행 40876318386](https://github.com/ckengus/little_caravan/actions/runs/40876318386): build/deploy 모두 success.
- 배포된 앱 커밋: d2a4ae27959b2ef4e532015547339882e6223aa1. 동일 커밋 Validate 실행 40873135547도 success.
- 배포 로그의 실제 환경 주소: https://ckengus.github.io/little_caravan/ .
- [캐릭터 테스트 필드 열기](https://ckengus.github.io/little_caravan/?scene=character-lab)
- 이전 Pages 설정 404 차단은 해소됐다. 확인 도구에서 공개 페이지 본문을 열지 못해 배포 후 실제 렌더링·조작은 아직 검증하지 않았다. 사용자 브라우저에서 접속·더미 투입·자동 공격·일시정지·초기화를 확인한다.
- 정식 아트와 실제 휴대폰 검수는 별도이며 아직 완료가 아니다.

## 현재 전투 연출 방향

사용자 결정으로 정교한 양손검 다자세 제작 대신 **대기1장+무기 포함 공격1장+이동·궤적·적 반응**을 채택했다. [코덱스 작업지시](docs/tasks/M2_SIMPLE_COMBAT.md)와 [아트 규격](docs/ANIMATION_PIPELINE.md)을 따른다. 이번 변경은 문서 변경이며 배포 화면은 아직 기존 M1이다.
