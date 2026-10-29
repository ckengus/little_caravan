import Phaser from 'phaser';
import { Lab } from './domain/lab';
import { labels, type Action } from './data/actions';
import { LabScene } from './game/scene';
import { bindMovement } from './ui/input';
import './style.css';
import { actorView } from './game/actorView';
const lab = new Lab();
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<header><span class="eyebrow">LITTLE CARAVAN / DEVELOPMENT FIELD 01</span><h1>여행을 떠나기 전,<br>한 동작씩.</h1><p>캐릭터 동작 테스트 필드 <span class="badge">M2 · 간결 연출 시험/임시 아트</span></p></header>
<main><section class="field"><div class="field-head"><strong>CHARACTER LAB</strong><span>평지 · 주인공 / 훈련 더미</span></div><div id="game" role="img" aria-label="주인공과 훈련 더미 테스트 필드"></div><output id="status" aria-live="off"></output><p class="notice">대기/무기 포함 공격 2개 임시 SVG 포즈로 연출을 시험합니다. 승인된 PNG는 아직 없습니다. 걷기·찌르기·CC 자세는 임시 대체이며 무기 외형은 고정입니다.</p></section>
<aside><section><h2>01 / 동작</h2><div class="buttons"><button data-action="idle">대기</button><button data-walk="-1">← 좌로 걷기</button><button data-walk="1">우로 걷기 →</button>${(['slash','thrust','dash','dashSlash','stagger','knockback'] as Action[]).map(a=>`<button data-action="${a}">${labels[a]}${a==='knockback'?' / 넘어짐 / 기상':''}</button>`).join('')}</div><p>걷기: 누르는 동안 · A/D 또는 ←/→<br>베기: Space · 공격 중 일반 입력 무시</p></section>
<section><h2>02 / 전투</h2><label><input id="auto" type="checkbox"> 자동 접근·공격</label><div class="buttons"><button id="spawn">더미 투입</button><button id="remove">더미 제거</button><button id="reset">전체 초기화</button></div></section>
<section><h2>03 / 재생·검사</h2><label>배속 <select id="speed"><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="1" selected>1×</option></select></label><div class="buttons"><button id="pause" aria-pressed="false">일시정지</button><button id="step" disabled>한 프레임 진행</button></div><label><input id="debug" type="checkbox" checked> 발 원점 · 공격 범위</label><p>한 프레임은 0.1초 경계까지 진행합니다.<br>피해 10 · 더미 HP 100 — 모두 임시 수치</p></section></aside></main><footer>동작 연결과 타격 시점 검증용 · 정식 게임 및 시각 승인 전</footer>`;
const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const clear = bindMovement(lab);
document.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(b=>b.onclick=()=>lab.act(b.dataset.action as Action));
el('spawn').onclick=()=>lab.spawn(); el('remove').onclick=()=>lab.remove();
el<HTMLInputElement>('auto').onchange=e=>{ clear(); lab.auto=(e.target as HTMLInputElement).checked; };
el<HTMLSelectElement>('speed').onchange=e=>lab.speed=Number((e.target as HTMLSelectElement).value);
el('pause').onclick=()=>{lab.paused=!lab.paused; el('pause').textContent=lab.paused?'계속 재생':'일시정지'; el('pause').setAttribute('aria-pressed',String(lab.paused)); el<HTMLButtonElement>('step').disabled=!lab.paused;};
el('step').onclick=()=>lab.step();
el('reset').onclick=()=>{ clear();lab.reset();el<HTMLInputElement>('auto').checked=false;el<HTMLSelectElement>('speed').value='1';el('pause').textContent='일시정지';el('pause').setAttribute('aria-pressed','false');el<HTMLButtonElement>('step').disabled=true; };
new Phaser.Game({type:Phaser.AUTO,parent:'game',width:960,height:420,backgroundColor:'#203e3c',scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:new LabScene(lab,()=>{el('status').textContent=`${labels[lab.state]} (${lab.state}) · 연출 ${actorView(lab).phase} · 프레임 ${lab.frame+1} · x ${lab.x.toFixed(1)} · ${lab.time.toFixed(2)}s · 더미 HP ${lab.dummy?.hp ?? '—'} · 타격 ${lab.hits}`;},()=>el<HTMLInputElement>('debug').checked),audio:{noAudio:true}});
