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

- M1 웹 테스트 필드와 CI/Pages 워크플로를 구현했다. 로컬 기능 검증 결과는 STATUS를 참고한다. 원격 배포는 아직 실행하지 않았다.
- 첫 목표는 **웹 캐릭터 동작 테스트 필드**다. 정식 게임 UI나 APK부터 만들지 않는다.
- 선택된 외형: [아트 설명](assets/art/references/README.md) / [일행 PNG](assets/art/references/little-caravan-party-v1.png).
- 이 PNG는 외형 참고자료이며 완성된 애니메이션 시트나 분리 부품이 아니다.

## Codex 첫 작업

> AGENTS.md와 docs/STATUS.md를 먼저 읽고 나머지 기획·개발 문서를 확인한다. ROADMAP의 M1을 구현하고, 가능한 범위에서 M2의 임시 주인공과 더미 전투 연결까지 진행한다. 먼저 저장소 실물을 확인하고 기존 파일을 보존한다. 아트가 없는 동작은 명시적인 임시 표시로 구현하되, 테스트 필드 구축은 계속한다. 실행·빌드·테스트 결과와 접속 방법을 제공하고 STATUS와 ROADMAP을 갱신한다. 시각 품질은 사용자 검수 전까지 완료로 표시하지 않는다.

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

걷기 버튼을 누르고 있거나 A/D·방향키로 이동, Space로 베기. 더미 투입 후 자동 접근·공격을 켤 수 있다. 재생 패널에서 배속·일시정지·한 프레임 진행과 디버그 표시를 조절한다. 모든 도형과 동작은 임시이며 정식 아트가 아니다.

CI는 설치→타입 검사→단위 테스트→빌드→브라우저 테스트를 실행한다. 기능 브랜치의 원격 Validate 성공을 확인했고 [PR #1](https://github.com/ckengus/little_caravan/pull/1)을 main에 병합했다. main의 Pages 배포는 빌드 성공 후 Pages 미활성화 관련 configure-pages 404로 실패했다.

저장소 [Settings → Pages](https://github.com/ckengus/little_caravan/settings/pages)에서 Build and deployment → Source를 **GitHub Actions**로 설정한다. 이후 Actions → Deploy Pages → Run workflow(main) 또는 실패 실행 재시도. 배포 성공과 실제 접속 확인 전까지 공개 테스트 URL은 미확정이다.

