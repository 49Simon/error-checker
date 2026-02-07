// Version: 1.0.0

(async () => {
    try {
        let existing = document.getElementById('ac');
        if (existing) existing.remove();
        let o = document.createElement('div');
        o.id = 'ac';
        o.style.cssText = 'position:fixed;top:20px;left:20px;width:420px;height:600px;background:white;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.3);z-index:99999;font-family:Arial;border:1px solid #e0e0e0;display:flex;flex-direction:column;resize:both;overflow:hidden;min-width:320px;min-height:200px';
        let h = document.createElement('div');
        h.style.cssText = 'background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:12px 16px;border-radius:11px 11px 0 0;cursor:move;font-weight:600;display:flex;justify-content:space-between;align-items:center;user-select:none;font-size:15px;flex-shrink:0';
        let t = document.createElement('span');
        t.textContent = '🔍 Error Checker';
        let b = document.createElement('div');
        b.style.cssText = 'display:flex;gap:10px';
        let m = document.createElement('button');
        m.textContent = '−';
        m.style.cssText = 'background:rgba(255,255,255,0.25);border:0;color:white;width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:18px';
        let x = document.createElement('button');
        x.textContent = '×';
        x.style.cssText = 'background:rgba(255,255,255,0.25);border:0;color:white;width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:18px';
        b.appendChild(m);
        b.appendChild(x);
        h.appendChild(t);
        h.appendChild(b);
        let c = document.createElement('div');
        c.style.cssText = 'padding:12px;overflow:auto;background:#fafbfc;flex:1';
        c.innerHTML = '<div style="padding:20px;text-align:center">Running...</div>';
        o.appendChild(h);
        o.appendChild(c);
        document.body.appendChild(o);
        let mi = false;
        m.onmouseover = () => m.style.background = 'rgba(255,255,255,0.35)';
        m.onmouseout = () => m.style.background = 'rgba(255,255,255,0.25)';
        x.onmouseover = () => x.style.background = 'rgba(255,255,255,0.35)';
        x.onmouseout = () => x.style.background = 'rgba(255,255,255,0.25)';
        m.onclick = e => {
            e.stopPropagation();
            mi = !mi;
            if (mi) {
                c.style.display = 'none';
                o.style.height = 'auto';
                o.style.resize = 'none';
                m.textContent = '□'
            } else {
                c.style.display = 'block';
                o.style.height = '600px';
                o.style.resize = 'both';
                m.textContent = '−'
            }
        };
        x.onclick = e => {
            e.stopPropagation();
            cancelRequested = true;
            o.remove()
        };
        let d = false,
            ox = 0,
            oy = 0;
        h.onmousedown = e => {
            if (e.target === m || e.target === x) return;
            d = true;
            ox = e.clientX - o.offsetLeft;
            oy = e.clientY - o.offsetTop
        };
        document.onmousemove = e => {
            if (!d) return;
            let nx = Math.max(0, Math.min(e.clientX - ox, window.innerWidth - o.offsetWidth));
            let ny = Math.max(0, Math.min(e.clientY - oy, window.innerHeight - o.offsetHeight));
            o.style.left = nx + 'px';
            o.style.top = ny + 'px'
        };
        document.onmouseup = () => d = false;
        let S = ms => new Promise(r => setTimeout(r, ms));
        let W = (f, to = 4000, i = 50) => {
            let st = Date.now();
            return new Promise(r => {
                let ck = () => f() ? r(true) : Date.now() - st > to ? r(false) : setTimeout(ck, i);
                ck()
            })
        };
        let P = (s) => {
            let ma = (s || '').match(/(\d+:\d{2}\.\d{2})\s*-\s*(\d+:\d{2}\.\d{2})/);
            return ma ? {
                s: ma[1],
                e: ma[2]
            } : null
        };
        let PA = (s) => {
            let ma = (s || '').match(/(\d+:\d{2}\.\d{2})\s*→\s*(\d+:\d{2}\.\d{2})/);
            return ma ? {
                s: ma[1],
                e: ma[2]
            } : null
        };
        let PB = (s) => {
            let tr = s.trim();
            let ma = tr.match(/^\[(\d+:\d{2}\.\d{2})\s*-\s*(\d+:\d{2}\.\d{2})\]$/);
            return ma ? {
                s: ma[1],
                e: ma[2]
            } : null
        };
        let E = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        let F = (ty, dt) => ty + (dt ? '\n' + dt : '');
        let U = (ht) => c.innerHTML = ht;
        let isRunning = false;
        let cancelRequested = false;
        let ae = [];
        let runScan = async () => {
            if (isRunning) return;
            isRunning = true;
            cancelRequested = false;
            ae = [];
            let sp = [...document.querySelectorAll('span.text-xs.font-mono.text-blue-600')];
            let expEl = [...document.querySelectorAll('div.text-sm.font-normal.text-muted-foreground')].find(e => (e.textContent || '').includes('segments'));
            if (expEl) {
                let expM = expEl.textContent.match(/(\d+)/);
                if (expM) {
                    let exp = parseInt(expM[1], 10);
                    if (sp.length < exp) {
                        U('<div style="padding:24px;text-align:center"><div style="font-size:48px">🛑</div><p style="font-size:18px;margin:8px 0;font-weight:600;color:#c53030">Mismatch Detected</p><p style="margin:0;font-size:14px;color:#2d3748">Found <b>' + sp.length + '</b> annotations but <b>' + exp + '</b> were expected, please close all annotation boxes first and re-run it again. <br><br>If this error keeps occurring even after closing all annotation boxes, report this issue to team leads.</p></div>');
                        isRunning = false;
                        return;
                    }
                }
            }
            let rw = [];
            let deletedCount = 0;
            for (let s of sp) {
                let iv = P(s.textContent || '');
                if (!iv) continue;
                let r = s.closest('div.p-4.cursor-pointer');
                if (!r) continue;
                let rd = r.querySelector('span.text-xs.text-red-600');
                if (r.querySelector('.line-through') || (rd && (rd.textContent || '').includes('Deleted'))) {
                    deletedCount++;
                    continue;
                }
                rw.push({
                    r: r,
                    i: iv
                })
            }
            let un = new Map();
            rw.forEach(rr => un.set(rr.r, rr));
            rw = [...un.values()];
            if (!rw.length) {
                U('<div style="padding:24px;text-align:center"><div style="font-size:48px">👀</div><p style="font-size:18px;margin:8px 0;font-weight:600">No annotations found</p>' + (deletedCount > 0 ? '<p style="margin:4px 0 0 0;font-size:12px;color:#718096">Skipped <b>' + deletedCount + '</b> deleted annotations</p>' : '') + '</div>');
                isRunning = false;
                return
            }
            let ch = 0;
            let notOpenedCount = 0;
            let allAnnotations = [];
            let normalizeTxt = (txt) => {
                return txt.split('\n').map(l => l.trim()).filter(l => l !== '').join('\n')
            };
            let getDupSig = (iv, txt) => {
                return iv.s + '|' + iv.e + '|' + normalizeTxt(txt)
            };
            for (let j = 0; j < rw.length; j++) {
                if (cancelRequested) {
                    isRunning = false;
                    return;
                }
                let {
                    r: ro,
                    i: iv
                } = rw[j];
                let lb = iv.s + ' - ' + iv.e;
                let er = [];
                let sn = {};
                U('<div style="padding:20px;text-align:center">Checking ' + (j + 1) + '/' + rw.length + '<br><small>' + lb + '</small></div>');
                ro.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                await S(200);
                ro.click();
                let ws = iv.s + ' → ' + iv.e;
                let pn = null;
                let fd = await W(() => {
                    let ts = [...document.querySelectorAll('textarea')];
                    for (let ta of ts) {
                        let ct = ta.closest('div.p-4.space-y-4') || ta.parentElement;
                        if (ct && (ct.textContent || '').includes(ws)) {
                            pn = ct;
                            return true
                        }
                    }
                    return false
                }, 4000);
                if (!fd || !pn) {
                    let ts = [...document.querySelectorAll('textarea')];
                    for (let ta of ts) {
                        let el = ta.parentElement;
                        while (el && el !== document.body) {
                            if ((el.textContent || '').includes(ws)) {
                                pn = el;
                                break
                            }
                            el = el.parentElement
                        }
                        if (pn) break
                    }
                }
                if (!pn) {
                    notOpenedCount++;
                    if (!sn.p) {
                        er.push(F('Could not open panel', ''));
                        sn.p = true
                    }
                    allAnnotations.push({
                        l: lb,
                        e: er,
                        t: '',
                        dupSig: null,
                        el: ro
                    });
                    continue
                }
                ch++;
                let ar = PA(pn.textContent || '');
                if (!ar && !sn.i) {
                    er.push(F('Could not read panel Interval', ''));
                    sn.i = true
                } else if (ar && (ar.s !== iv.s || ar.e !== iv.e) && !sn.im) {
                    er.push(F('Interval mismatch', 'Panel=' + ar.s + ' - ' + ar.e));
                    sn.im = true
                }
                let ta = pn.querySelector('textarea');
                let tx = (ta ? ta.value : '').replace(/\r\n/g, '\n');
                if (!tx.trim() && !sn.em) {
                    er.push(F('Empty annotation text', ''));
                    sn.em = true
                }
                let ln = tx.split('\n');
                let l0 = ln[0] || '';
                let l0t = l0.trim();
                if (!tx.trim()) {
                    if (!sn.nt) {
                        er.push(F('No timestamp was copied', ''));
                        sn.nt = true
                    }
                } else {
                    let b0 = PB(l0);
                    let hb = /\[.*\d+:\d{2}\.\d{2}.*-.*\d+:\d{2}\.\d{2}.*\]/.test(tx);
                    if (!b0 && hb) {
                        let bf = /\[.*\d+:\d{2}\.\d{2}.*-.*\d+:\d{2}\.\d{2}.*\]/.test(l0);
                        if (bf && l0t !== l0 && !sn.tn) {
                            er.push(F('Timestamp not on its own line at the top', 'First line has extra content'));
                            sn.tn = true
                        } else if (bf) {
                            let tb = PB(l0);
                            if (!tb && !sn.tf) {
                                er.push(F('Timestamp format issue', 'Check brackets, line breaks and spacing'));
                                sn.tf = true
                            }
                        } else if (!sn.tn) {
                            er.push(F('Timestamp not on its own line at the top', 'Timestamp found elsewhere in text'));
                            sn.tn = true
                        }
                    } else if (!b0 && !hb && !sn.nt) {
                        er.push(F('No timestamp was copied', 'Missing [XX:XX.XX - XX:XX.XX] format'));
                        sn.nt = true
                    } else if (b0 && (b0.s !== iv.s || b0.e !== iv.e) && !sn.cm) {
                        er.push(F('Copy time mismatch', 'Expected [' + iv.s + ' - ' + iv.e + '] but found [' + b0.s + ' - ' + b0.e + ']'));
                        sn.cm = true
                    }
                }
                let hasCS = false;
                if (ln.length > 1) {
                    let ll = ln[ln.length - 1] || '';
                    if (ll.trim() === '') {
                        if (!sn.te) {
                            er.push(F('Trailing empty line', ''));
                            sn.te = true
                        }
                    }
                }
                let le = false;
                for (let i = 1; i < ln.length; i++) {
                    let li = ln[i];
                    let tr = li.trim();
                    let em = tr === '';
                    let tl = !!PB(tr);
                    if (em && !sn['el' + i]) {
                        er.push(F('(warning) Empty line break', 'Ignore this if its valid according to guidelines'));
                        sn['el' + i] = true;
                    }
                    if (li.length > 0 && tr && /[ \t]+$/.test(li) && !tl && !sn['t' + i]) {
                        er.push(F('Trailing space', 'Line="' + li + '"'));
                        sn['t' + i] = true
                    }
                    if (em && le && !hasCS) {
                        hasCS = true;
                        if (!sn.cs) {
                            er.push(F('Consecutive empty lines', ''));
                            sn.cs = true
                        }
                    }
                    le = em;
                    if (em && li.length > 0 && !sn['w' + i]) {
                        er.push(F('Whitespace only line', 'Line="' + li + '"'));
                        sn['w' + i] = true
                    }
                    if (tr) {
                        if (li.includes('  ') && !sn['d' + i]) {
                            er.push(F('Double space', 'Line="' + li + '"'));
                            sn['d' + i] = true
                        }
                        if (li[0] === ' ' && !sn['l' + i]) {
                            er.push(F('Leading space', 'Line="' + li + '"'));
                            sn['l' + i] = true
                        }
                    }
                }
                let cl = ln.slice(1).map(xx => xx.trim());
                let ne = cl.filter(xx => xx !== '');
                if (ne.length === 0 && !sn.ot) {
                    er.push(F('Only timestamp found', 'Add some annotation text or delete this block'));
                    sn.ot = true;
                }
                if (ne.length === 1 && ne[0].length === 1 && !sn.sl) {
                    er.push(F('(warning) Single letter found', 'Ignore this if its valid according to guidelines'));
                    sn.sl = true
                } else if (ln.slice(1).join('\n').match(/(^|\s)([A-Za-z0-9$])(\s|$)/) && !sn.st) {
                    er.push(F('(warning) Single letter found', 'Ignore this if its valid according to guidelines'));
                    sn.st = true
                }
                allAnnotations.push({
                    l: lb,
                    e: er,
                    t: tx,
                    dupSig: getDupSig(iv, tx),
                    el: ro
                });
                let bt = [...pn.querySelectorAll('button')];
                let cn = bt.find(bb => (bb.textContent || '').trim().toLowerCase() === 'save');
                if (cn) cn.click();
                else document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Escape',
                    bubbles: true
                }));
                await S(250)
            }
            let dupGroups = new Map();
            allAnnotations.forEach((an, idx) => {
                if (!an.dupSig) return;
                if (!dupGroups.has(an.dupSig)) dupGroups.set(an.dupSig, []);
                dupGroups.get(an.dupSig).push({
                    an: an,
                    idx: idx
                })
            });
            dupGroups.forEach((items, sig) => {
                if (items.length > 1) {
                    items[0].an.e.push(F('(warning) Potential duplicate', 'Found ' + items.length + ' annotations with same exact timestamps and text content. Ignore this if they are not duplicates.'));
                    items[0].an.dupEls = items.map(it => it.an.el);
                }
            });
            allAnnotations.forEach(an => {
                if (an.e.length) ae.push(an)
            });
            if (!ae.length) {
                U('<div style="padding:24px;text-align:center"><div style="font-size:48px">✅</div><p style="font-size:18px;margin:8px 0;font-weight:600">All Clear!</p><p style="margin:0;font-size:14px">Checked <b>' + ch + '</b> annotations</p>' + (deletedCount > 0 ? '<p style="margin:4px 0 0 0;font-size:12px;color:#718096">Skipped <b>' + deletedCount + '</b> deleted annotations</p>' : '') + '<button id="rescanBtn" style="background:#667eea;color:white;border:0;padding:8px 16px;border-radius:6px;font-size:14px;cursor:pointer;margin-top:12px">🔄 Re-scan</button></div>');
                document.getElementById('rescanBtn').onclick = () => runScan();
                isRunning = false;
                return
            }
            let totalWarnings = 0,
                totalErrors = 0;
            ae.forEach(a => {
                a.e.forEach(errStr => {
                    if (errStr.includes('(warning)')) totalWarnings++;
                    else totalErrors++;
                });
            });
            let hdrBg = totalErrors > 0 ? 'linear-gradient(135deg,#fed7d7,#feb2b2)' : 'linear-gradient(135deg,#fefcbf,#faf089)';
            let hdrClr = totalErrors > 0 ? '#742a2a' : '#744210';
            let hdrIcon = totalErrors > 0 ? '❌' : '⚠️';
            let hdrTitle = totalErrors > 0 ? 'Errors Found' : 'Warnings';
            let ht = '<div style="padding:12px"><div id="statusHeader" data-errors="' + totalErrors + '" data-warnings="' + totalWarnings + '" data-checked="' + ch + '" data-deleted="' + deletedCount + '" style="background:' + hdrBg + ';border-radius:8px;padding:12px;margin-bottom:12px;text-align:center"><p id="hdrTitle" style="font-size:17px;margin:0 0 4px 0;font-weight:600;color:' + hdrClr + '">' + hdrIcon + ' ' + hdrTitle + '</p>';
            let stats = [];
            if (totalErrors > 0) stats.push('<b>' + totalErrors + '</b> error' + (totalErrors > 1 ? 's' : ''));
            if (totalWarnings > 0) stats.push('<b>' + totalWarnings + '</b> warning' + (totalWarnings > 1 ? 's' : ''));
            ht += '<p id="hdrStats" style="margin:0;color:' + hdrClr + ';font-size:13px">' + stats.join(' | ') + '</p>';
            ht += '<p id="hdrChecked" style="margin:4px 0 0 0;color:' + hdrClr + ';font-size:12px;opacity:0.8">Checked ' + ch + '</p>' + (deletedCount > 0 ? '<p style="margin:2px 0 0 0;color:' + hdrClr + ';font-size:11px;opacity:0.7">Skipped <b>' + deletedCount + '</b> deleted annotations</p>' : '') + '</div>';
            ht += '<div style="display:flex;gap:8px;margin-bottom:12px">';
            ht += '<button id="rescanBtn" style="flex:1;background:#667eea;color:white;border:0;padding:8px 12px;border-radius:6px;font-size:13px;cursor:pointer;font-weight:500">🔄 Re-scan</button>';
            ht += '</div>';
            if (notOpenedCount > 0) {
                ht += '<div style="background:#fff5f5;border-left:4px solid #feb2b2;padding:8px 12px;margin-bottom:12px;font-size:12px;color:#9b2c2c">Please close all annotation boxes and re-run. If "not opened" persists, report to team leads.</div>';
            }
            ae.forEach((an, idx) => {
                let id = 'c' + idx;
                ht += '<div style="margin:0 0 10px 0;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden"><div class="tg" data-id="' + id + '" style="padding:10px 12px;cursor:pointer;font-weight:500;font-size:13px;display:flex;justify-content:space-between;align-items:center;background:#f7fafc"><div style="flex:1"><div style="font-family:monospace;color:#4a5568">' + E(an.l) + '</div><div style="font-size:11px;color:#a0aec0">' + an.e.length + ' issue' + (an.e.length > 1 ? 's' : '') + '</div></div><button class="jb" data-idx="' + idx + '" style="background:#667eea;color:white;border:0;padding:4px 10px;border-radius:4px;font-size:11px;cursor:pointer;margin-right:8px">Find</button><span class="ar">▼</span></div><div id="' + id + '">';
                an.e.forEach((ee, ei) => {
                    let isW = ee.includes('(warning)');
                    let ibg = isW ? '#feebc8' : '#fed7d7';
                    let icl = isW ? '#d69e2e' : '#c53030';
                    let sym = isW ? '⚠️' : '❌';
                    let rowId = 'r' + idx + '_' + ei;
                    ht += '<div id="' + rowId + '" style="padding:8px 12px;border-top:1px solid #e2e8f0;background:' + (ei % 2 ? '#fafbfc' : '#fff') + '"><div style="display:flex;gap:6px;align-items:flex-start"><div class="issue-icon" style="background:' + ibg + ';color:' + icl + ';min-width:18px;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold">' + sym + '</div><pre style="white-space:pre-wrap;margin:0;font-size:12px;flex:1;font-family:Arial">' + E(ee) + '</pre>' + (isW ? '<button class="vb" data-row="' + rowId + '" style="background:#e2e8f0;color:#4a5568;border:0;padding:2px 8px;border-radius:4px;font-size:10px;cursor:pointer;white-space:nowrap" title="Mark as verified/valid">✓ OK</button>' : '') + '</div></div>'
                });
                if (an.t) ht += '<div style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#f7fafc"><div style="font-weight:600;font-size:11px;color:#4a5568;margin-bottom:6px">📝 Annotation Text</div><pre style="white-space:pre-wrap;margin:0;font-size:12px;color:#000;line-height:1.6;padding:8px;background:#fff;border-radius:6px;border:1px solid #e2e8f0;font-family:Arial">' + E(an.t) + '</pre></div>';
                ht += '</div></div>'
            });
            ht += '</div>';
            U(ht);
            setTimeout(() => {
                document.querySelectorAll('.tg').forEach(tg => {
                    tg.onclick = function(ev) {
                        if (ev.target.classList.contains('jb')) return;
                        let id = this.getAttribute('data-id');
                        let el = document.getElementById(id);
                        let ar = this.querySelector('.ar');
                        if (el.style.display === 'none') {
                            el.style.display = 'block';
                            ar.textContent = '▼'
                        } else {
                            el.style.display = 'none';
                            ar.textContent = '▶'
                        }
                    }
                });
                document.querySelectorAll('.jb').forEach(jb => {
                    jb.onclick = function(ev) {
                        ev.stopPropagation();
                        let idx = parseInt(this.getAttribute('data-idx'), 10);
                        let an = ae[idx];
                        if (an && an.el) {
                            let elsToHighlight = an.dupEls ? an.dupEls : [an.el];
                            an.el.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                            elsToHighlight.forEach(el => {
                                el.style.transition = 'box-shadow 0.3s';
                                el.style.boxShadow = '0 0 0 3px #667eea';
                            });
                            setTimeout(() => {
                                elsToHighlight.forEach(el => {
                                    el.style.boxShadow = '';
                                });
                            }, 2000)
                        }
                    }
                });
                let updateHeader = () => {
                    let header = document.getElementById('statusHeader');
                    if (!header) return;
                    let totalErr = parseInt(header.getAttribute('data-errors'), 10);
                    let totalWarn = parseInt(header.getAttribute('data-warnings'), 10);
                    let checked = header.getAttribute('data-checked');
                    let verifiedCount = document.querySelectorAll('.vb.verified').length;
                    let hdrTitle = document.getElementById('hdrTitle');
                    let hdrStats = document.getElementById('hdrStats');
                    let hdrChecked = document.getElementById('hdrChecked');
                    if (totalErr === 0 && verifiedCount === totalWarn) {
                        header.style.background = 'linear-gradient(135deg,#c6f6d5,#9ae6b4)';
                        if (hdrTitle) {
                            hdrTitle.style.color = '#276749';
                            hdrTitle.innerHTML = '✅ All Clear!';
                        }
                        if (hdrStats) {
                            hdrStats.style.color = '#276749';
                            hdrStats.innerHTML = '<b>' + totalWarn + '</b> warning' + (totalWarn > 1 ? 's' : '') + ' verified as valid';
                        }
                        if (hdrChecked) hdrChecked.style.color = '#276749';
                    } else if (totalErr === 0) {
                        header.style.background = 'linear-gradient(135deg,#fefcbf,#faf089)';
                        if (hdrTitle) {
                            hdrTitle.style.color = '#744210';
                            hdrTitle.innerHTML = '⚠️ Warnings to Verify';
                        }
                        if (hdrStats) {
                            hdrStats.style.color = '#744210';
                            let remaining = totalWarn - verifiedCount;
                            hdrStats.innerHTML = '<b>' + remaining + '</b> warning' + (remaining > 1 ? 's' : '') + ' remaining' + (verifiedCount > 0 ? ' | <b>' + verifiedCount + '</b> verified' : '');
                        }
                        if (hdrChecked) hdrChecked.style.color = '#744210';
                    }
                };
                document.querySelectorAll('.vb').forEach(vb => {
                    vb.onclick = function(ev) {
                        ev.stopPropagation();
                        let rowId = this.getAttribute('data-row');
                        let row = document.getElementById(rowId);
                        if (row) {
                            let icon = row.querySelector('.issue-icon');
                            if (this.classList.contains('verified')) {
                                this.classList.remove('verified');
                                this.textContent = '✓ OK';
                                this.style.background = '#e2e8f0';
                                this.style.color = '#4a5568';
                                row.style.opacity = '1';
                                if (icon) {
                                    icon.style.background = '#feebc8';
                                    icon.innerHTML = '⚠️';
                                }
                            } else {
                                this.classList.add('verified');
                                this.textContent = '✓ Verified';
                                this.style.background = '#c6f6d5';
                                this.style.color = '#276749';
                                row.style.opacity = '0.5';
                                if (icon) {
                                    icon.style.background = '#c6f6d5';
                                    icon.innerHTML = '✅';
                                }
                            }
                        }
                        updateHeader();
                    }
                });
                let rescanBtn = document.getElementById('rescanBtn');
                if (rescanBtn) rescanBtn.onclick = () => runScan();
            }, 100);
            isRunning = false;
        };
        runScan();
    } catch (err) {
        alert('Error: ' + err.message);
        console.error(err)
    }
})();
