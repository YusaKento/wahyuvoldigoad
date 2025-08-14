import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ShieldCheck,
  Flame,
  Skull,
  AlertTriangle,
  FlaskConical,
  Eye,
  BadgeCheck,
  CheckCircle2,
  XCircle,
  Download,
  Printer,
  Sun,
  PlugZap,
  LifeBuoy,
  User,
  Users,
  FileText,
  Hand,
  Shield,
  ClipboardList,
  ChevronRight,
  Home,
  Info,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// ================= Helper Components =================
const Section = ({ id, icon: Icon, title, children }) => (
  <section id={id} className="scroll-mt-24" aria-labelledby={`${id}-title`}>
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="gap-2">
        <div className="flex items-center gap-3">
          {Icon && <Icon aria-hidden className="w-6 h-6" />}
          <CardTitle id={`${id}-title`} className="text-xl md:text-2xl">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="prose prose-slate dark:prose-invert max-w-none">{children}</CardContent>
    </Card>
  </section>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-white/60 dark:bg-black/20 border-gray-200 dark:border-gray-700">
    {children}
  </span>
);

// ================= Quiz Data =================
const defaultQuestions = [
  {
    id: 1,
    q: "Sebelum praktikum dimulai, apa hal pertama yang harus dilakukan?",
    options: [
      "Langsung mencoba semua alat",
      "Membaca petunjuk/lembar kerja dan instruksi keselamatan",
      "Mencampur bahan kimia untuk uji coba",
      "Meminjam kacamata dari teman jika perlu",
    ],
    answer: 1,
    explain: "Selalu baca petunjuk dan aturan keselamatan sebelum menyentuh alat/bahan.",
  },
  {
    id: 2,
    q: "APD (Alat Pelindung Diri) minimum di laboratorium adalah…",
    options: [
      "Sarung tangan kain, sandal, topi",
      "Kacamata pelindung, jas lab, sepatu tertutup",
      "Masker kain saja",
      "Tidak perlu APD jika hati-hati",
    ],
    answer: 1,
    explain: "Kacamata pelindung, jas lab, dan sepatu tertutup adalah standar minimum.",
  },
  {
    id: 3,
    q: "Jika reagen tumpah pada meja, tindakan yang benar adalah…",
    options: [
      "Dibiarkan menguap sendiri",
      "Dibersihkan segera sesuai SOP dengan alat pembersih yang sesuai",
      "Ditekan dengan tisu lalu dibuang ke tempat sampah biasa",
      "Disapu ke lantai",
    ],
    answer: 1,
    explain: "Ikuti SOP tumpahan (spill kit) dan laporkan ke guru/laboran.",
  },
  {
    id: 4,
    q: "Simbol tengkorak dan tulang bersilang menunjukkan bahaya…",
    options: ["Mudah terbakar", "Korosif", "Beracun akut", "Tekanan gas"],
    answer: 2,
    explain: "Piktogram GHS tengkorak = toksisitas akut tinggi/beracun.",
  },
  {
    id: 5,
    q: "Apa yang TIDAK boleh dilakukan saat memanaskan bahan kimia?",
    options: [
      "Mengarahkah mulut tabung reaksi ke orang lain",
      "Menggunakan penjepit tabung reaksi",
      "Memakai kacamata pelindung",
      "Menggunakan statif dan kasa kawat",
    ],
    answer: 0,
    explain: "Mulut tabung tidak boleh diarahkan ke diri sendiri maupun orang lain.",
  },
];

// Utility (dipakai juga untuk pengujian)
function getScore(answers, questions) {
  let s = 0;
  questions.forEach((q) => {
    if (answers[q.id] === q.answer) s += 1;
  });
  return s;
}

// ================= Main App =================
export default function App() {
  const [dark, setDark] = useState(true);
  const [name, setName] = useState("");
  const [kelas, setKelas] = useState("");
  const [agree, setAgree] = useState(false);
  const [answers, setAnswers] = useState({});
  const [questions] = useState(defaultQuestions);
  const [notes, setNotes] = useState("");

  const score = useMemo(() => getScore(answers, questions), [answers, questions]);

  const toggleTheme = () => {
    setDark((d) => !d);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };

  const printPage = () => {
    window.print();
  };

  const checklistItems = [
    { id: "apd", text: "Memakai APD (kacamata, jas lab, sepatu tertutup)." },
    { id: "ikat", text: "Mengikat rambut panjang dan melepas aksesoris longgar." },
    { id: "baca", text: "Membaca SOP/petunjuk praktikum sebelum mulai." },
    { id: "bersih", text: "Membersihkan meja kerja dari barang yang tidak perlu." },
    { id: "alat", text: "Memeriksa kondisi alat (retak, kabel aus, dll)." },
    { id: "label", text: "Mengecek label bahan kimia dan piktogram GHS." },
    { id: "tahu", text: "Mengetahui lokasi APAR, kotak P3K, shower & eyewash." },
    { id: "lapor", text: "Melapor segera jika terjadi insiden/tumpahan/pecah." },
    { id: "buang", text: "Membuang limbah sesuai jenisnya (kimia, kaca, biologis)." },
  ];
  const [checked, setChecked] = useState({});
  const allChecked = checklistItems.every((i) => checked[i.id]);

  // -------- Pengujian (runtime) --------
  const tests = useMemo(() => {
    const t = [];
    // TC1: semua jawaban benar -> skor penuh
    const allCorrect = Object.fromEntries(questions.map((q) => [q.id, q.answer]));
    t.push({ name: "Skor semua jawaban benar", pass: getScore(allCorrect, questions) === questions.length });

    // TC2: semua jawaban A (index 0) -> skor sesuai jumlah kunci 0
    const allZero = Object.fromEntries(questions.map((q) => [q.id, 0]));
    const expected2 = questions.filter((q) => q.answer === 0).length;
    t.push({ name: "Skor semua jawaban A", pass: getScore(allZero, questions) === expected2 });

    // TC3: tanpa jawaban -> 0
    t.push({ name: "Skor tanpa jawaban", pass: getScore({}, questions) === 0 });

    // TC4 (tambahan): jawaban acak tetapi satu benar -> 1
    const oneRight = { [questions[0].id]: questions[0].answer };
    t.push({ name: "Satu jawaban benar", pass: getScore(oneRight, questions) === 1 });

    return t;
  }, [questions]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100">
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Home className="w-5 h-5" />
          <h1 className="text-lg md:text-2xl font-semibold">Edukasi Fisika: Keselamatan Kerja Laboratorium</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" className="rounded-2xl" onClick={toggleTheme}>
              <Shield className="w-4 h-4 mr-2" />{dark ? "Mode Terang" : "Mode Gelap"}
            </Button>
            <Button className="rounded-2xl" onClick={printPage}>
              <Printer className="w-4 h-4 mr-2" />Cetak / Simpan PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-6 print:max-w-none print:px-8">
        {/* Navigasi kiri */}
        <nav className="md:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5" />Navigasi Materi
              </CardTitle>
              <CardDescription>Gunakan daftar ini untuk berpindah bagian.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {[
                  ["pendahuluan", "Pendahuluan"],
                  ["aturan", "Aturan Umum"],
                  ["apd", "APD Wajib"],
                  ["piktogram", "Piktogram Bahaya"],
                  ["emergency", "Prosedur Darurat"],
                  ["checklist", "Checklist Pra-Praktikum"],
                  ["quiz", "Kuis Cepat"],
                  ["lembar-tugas", "Lembar Tugas"],
                  ["ref", "Referensi"],
                  ["tests", "Pengujian"],
                ].map(([id, label]) => (
                  <li key={id}>
                    <a href={`#${id}`} className="flex items-center gap-2 hover:underline">
                      <ChevronRight className="w-4 h-4" /> {label}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </nav>

        {/* Konten utama */}
        <div className="md:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Section id="pendahuluan" icon={Info} title="Pendahuluan">
              <p>
                Topik ini membahas <strong>Keselamatan Kerja Laboratorium</strong> sebagai bagian dari pendidikan Fisika. Tujuan pembelajaran: peserta didik mampu menjelaskan prinsip K3 (Keselamatan dan Kesehatan Kerja), mengidentifikasi <em>hazard</em>, memilih APD yang tepat, membaca piktogram bahaya, serta menerapkan SOP darurat.
              </p>
              <div className="grid md:grid-cols-2 gap-4 not-prose mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Identitas Siswa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <Label htmlFor="nama">Nama</Label>
                      <Input id="nama" placeholder="Tulis nama lengkap" value={name} onChange={(e) => setName(e.target.value)} />
                      <Label htmlFor="kelas">Kelas</Label>
                      <Input id="kelas" placeholder="Contoh: IX-B / X IPA 1" value={kelas} onChange={(e) => setKelas(e.target.value)} />
                      <div className="flex items-center gap-2 mt-2">
                        <Switch id="pernyataan" checked={agree} onCheckedChange={setAgree} />
                        <Label htmlFor="pernyataan" className="text-sm">Saya berkomitmen mematuhi aturan K3 di laboratorium.</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Capaian Pembelajaran</CardTitle>
                    <CardDescription>Ringkas dan terukur</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Menjelaskan 5 prinsip K3 di laboratorium.</li>
                      <li>Mengidentifikasi minimal 6 piktogram GHS.</li>
                      <li>Mendemonstrasikan prosedur darurat dasar (APAR, P3K, eyewash).</li>
                      <li>Mengisi checklist K3 sebelum praktikum.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </Section>
          </motion.div>

          <Section id="aturan" icon={ShieldCheck} title="Aturan Umum di Laboratorium">
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="list-decimal pl-6 space-y-2">
                <li>Datang tepat waktu dan ikuti pengarahan guru/laboran.</li>
                <li>Dilarang makan, minum, atau bercanda berlebihan di area kerja.</li>
                <li>
                  Kenali lokasi <Badge>APAR</Badge>, <Badge>kotak P3K</Badge>, <Badge>eyewash & safety shower</Badge>.
                </li>
                <li>Gunakan alat sesuai fungsinya; laporkan kerusakan segera.</li>
                <li>Tulis label dan catat setiap bahan yang digunakan.</li>
                <li>Buang limbah sesuai kategori: kimia cair, padat, kaca, biologis.</li>
                <li>Jaga kebersihan meja, cuci tangan setelah praktikum.</li>
              </ul>
              <div className="not-prose grid gap-3">
                <Card className="bg-emerald-50 dark:bg-emerald-950/30">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />Lakukan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Pakai APD lengkap setiap saat.</li>
                      <li>Ikat rambut panjang; gunakan pakaian berlengan.</li>
                      <li>Gunakan penjepit saat memanaskan tabung reaksi.</li>
                      <li>Baca MSDS/SDS singkat sebelum memakai reagen baru.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-rose-50 dark:bg-rose-950/30">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <XCircle className="w-5 h-5" />Jangan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Mengarahkan mulut tabung ke diri sendiri/orang lain.</li>
                      <li>Mencampur bahan tanpa instruksi.</li>
                      <li>Menyentuh wajah/mata saat bekerja dengan bahan kimia.</li>
                      <li>Meninggalkan api bunsen tanpa pengawasan.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Section>

          <Section id="apd" icon={Shield} title="APD (Alat Pelindung Diri) Wajib">
            <div className="grid md:grid-cols-3 gap-4 not-prose">
              {[
                { icon: Eye, title: "Kacamata Pelindung", desc: "Melindungi mata dari percikan, asap, dan debu reaktif." },
                { icon: FlaskConical, title: "Jas Lab", desc: "Bahan katun/anti api, berlengan panjang, tertutup rapat." },
                { icon: User, title: "Sepatu Tertutup", desc: "Sol anti selip; hindari sandal/sepatu terbuka." },
                { icon: Hand, title: "Sarung Tangan", desc: "Pilih bahan (nitril/lateks) sesuai reagen; ganti jika rusak." },
                { icon: Sun, title: "Masker/Respirator", desc: "Gunakan saat ada uap/partikulat; perhatikan ventilasi." },
                { icon: LifeBuoy, title: "P3K Siaga", desc: "Ketahui isi dan cara penggunaan dasar." },
              ].map((it, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <it.icon className="w-5 h-5" />
                      <CardTitle className="text-base">{it.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600 dark:text-slate-300">{it.desc}</CardContent>
                </Card>
              ))}
            </div>
          </Section>

          <Section id="piktogram" icon={AlertTriangle} title="Piktogram Bahaya (GHS)">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 not-prose">
              {[
                { icon: Flame, title: "Mudah Terbakar", info: "Jauhkan dari sumber api/percikan; simpan rapat." },
                { icon: Skull, title: "Beracun Akut", info: "Jangan hirup/tertelan/tersentuh kulit; gunakan APD penuh." },
                { icon: PlugZap, title: "Bahaya Listrik", info: "Periksa kabel, ground, tangan kering saat menyentuh." },
                { icon: Sun, title: "Oksidator/Panas", info: "Rawan memicu reaksi; pisahkan dari bahan mudah terbakar." },
                { icon: Eye, title: "Iritasi Mata", info: "Gunakan kacamata pelindung dan eyewash tersedia." },
                { icon: AlertTriangle, title: "Iritan/Perhatian", info: "Ikuti SOP dan batasi paparan kulit/napas." },
              ].map((p, i) => (
                <Card key={i} className="hover:translate-y-0.5 transition-transform">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <p.icon className="w-5 h-5" />
                      <CardTitle className="text-base">{p.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600 dark:text-slate-300">{p.info}</CardContent>
                </Card>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">Catatan: ikon di atas bersifat edukatif (bukan seluruh set GHS resmi).</p>
          </Section>

          <Section id="emergency" icon={HelpCircle} title="Prosedur Darurat Singkat">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-amber-50 dark:bg-amber-950/30">
                <CardHeader>
                  <CardTitle className="text-base">Kebakaran Kecil</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>Matikan sumber api/arus listrik bila aman.</li>
                    <li>Gunakan APAR sesuai kelas kebakaran (A/B/C) atau selimut api.</li>
                    <li>Jika tak terkendali, evakuasi dan hubungi bantuan.</li>
                  </ol>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 dark:bg-blue-950/30">
                <CardHeader>
                  <CardTitle className="text-base">Paparan Bahan Kimia</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>Mata: bilas di eyewash 15–20 menit, buka kelopak.</li>
                    <li>Kulit: bilas air mengalir; lepas pakaian terkontaminasi.</li>
                    <li>Hirupan: pindah ke udara segar; longgarkan pakaian.</li>
                    <li>Laporkan dan catat kejadian (waktu, bahan, tindakan).</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Section id="checklist" icon={ClipboardList} title="Checklist Pra-Praktikum">
            <div className="space-y-3">
              {checklistItems.map((item) => (
                <label key={item.id} className="flex items-start gap-3 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    checked={!!checked[item.id]}
                    onChange={(e) => setChecked((c) => ({ ...c, [item.id]: e.target.checked }))}
                  />
                  <span>{item.text}</span>
                </label>
              ))}
              <div className="flex items-center gap-2 pt-2">
                {allChecked ? <BadgeCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                <p className="text-sm">{allChecked ? "Checklist lengkap! Siap praktikum." : "Pastikan semua poin sudah dicek."}</p>
              </div>
            </div>
          </Section>

          <Section id="quiz" icon={BadgeCheck} title="Kuis Cepat: Cek Pemahaman">
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <Card key={q.id} className="border-slate-200 dark:border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-base">{idx + 1}. {q.q}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {q.options.map((opt, i) => {
                      const chosen = answers[q.id] === i;
                      const correct = q.answer === i;
                      return (
                        <button
                          key={i}
                          onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                          className={[
                            "w-full text-left px-3 py-2 rounded-xl border transition",
                            chosen && correct && "border-emerald-500 ring-1 ring-emerald-300",
                            chosen && !correct && "border-rose-500 ring-1 ring-rose-300",
                            !chosen && "border-slate-200 dark:border-slate-800 hover:border-slate-400",
                          ].filter(Boolean).join(" ")}
                          aria-pressed={chosen}
                        >
                          <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                        </button>
                      );
                    })}
                    {answers[q.id] !== undefined && (
                      <p className="text-sm mt-2">
                        {answers[q.id] === q.answer ? (
                          <span className="inline-flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />Benar! {q.explain}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <XCircle className="w-4 h-4" />Kurang tepat. {q.explain}
                          </span>
                        )}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}

              <div className="flex items-center justify-between">
                <p className="text-sm">
                  Skor: <strong>{score}</strong> / {questions.length}
                </p>
                <Button variant="outline" onClick={() => setAnswers({})}>Reset Jawaban</Button>
              </div>
            </div>
          </Section>

          <Section id="lembar-tugas" icon={FileText} title="Lembar Tugas / Refleksi">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Sebutkan 3 contoh perilaku aman saat menggunakan api bunsen.</li>
              <li>Jelaskan langkah yang harus dilakukan jika asam kuat tumpah di meja.</li>
              <li>Gambarkan dan jelaskan 4 piktogram GHS yang kamu ketahui.</li>
              <li>Kelompokkan limbah berikut ke tempat yang tepat: kaca pecah, larutan NaOH bekas, kapas bekas darah (simulasi), kertas label.</li>
              <li>Tuliskan lokasi APAR, P3K, eyewash, dan rute evakuasi di lab sekolahmu.</li>
            </ol>
            <div className="not-prose mt-4 grid gap-2">
              <Label htmlFor="notes">Catatan/Refleksi</Label>
              <Textarea id="notes" placeholder="Tulis rangkuman pemahamanmu di sini…" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="flex gap-2 mt-3 print:hidden">
              <Button onClick={printPage}>
                <Download className="w-4 h-4 mr-2" />Cetak/Simpan sebagai PDF
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Tip: gunakan tombol di atas untuk menyimpan halaman ini sebagai PDF dan dikumpulkan ke guru.</p>
          </Section>

          <Section id="tests" icon={Users} title="Pengujian (Otomatis)">
            <p className="text-sm">Panel ini membantu memastikan fungsi inti aplikasi berjalan baik.</p>
            <div className="not-prose grid md:grid-cols-2 gap-3 mt-2">
              {tests.map((t, i) => (
                <Card key={i} className={t.pass ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-rose-50 dark:bg-rose-950/30"}>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      {t.pass ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />} {t.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-slate-600 dark:text-slate-300">Hasil: {t.pass ? "LULUS" : "GAGAL"}</CardContent>
                </Card>
              ))}
            </div>
          </Section>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 pb-10 pt-4 text-xs text-slate-500 flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
        <span>© {new Date().getFullYear()} Modul K3 Laboratorium Fisika.</span>
        <span className="hidden md:inline">•</span>
        <span>Disusun untuk tugas edukasi sekolah — dapat dicetak dan dikumpulkan.</span>
      </footer>

      <style>{`
        @media print {
          nav, header .button, .print\\:hidden { display: none !important; }
          header { position: static !important; }
          main { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
